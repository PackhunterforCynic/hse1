import { Resend } from 'resend';
import { contactSchema } from '../src/lib/validation.js';

// Vercel serverless function expects a default export
export default async function handler(req, res) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Honeypot check (spam protection)
  if (req.body.company) {
    // If the hidden field is filled, silently reject it as success to fool bots
    return res.status(200).json({ success: true, message: 'Message sent successfully (caught by honeypot).' });
  }

  // 3. Validation
  const validation = contactSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: validation.error.format() 
    });
  }

  const { name, email, phone, service, message } = validation.data;

  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!process.env.RESEND_API_KEY || !contactEmail) {
    console.error("Missing Resend API Key or Contact Email in environment variables.");
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  try {
    // 4. Send Notification Email to Site Owner
    await resend.emails.send({
      from: `Havilah Contact <${fromEmail}>`,
      to: [contactEmail],
      subject: `New Contact Request from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 40px 20px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #333;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="text-transform: uppercase; letter-spacing: 4px; font-size: 20px; font-weight: 300; margin: 0; color: #ffffff;">Havilah</h1>
            <p style="font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase; margin-top: 5px;">New Contact Request</p>
          </div>
          
          <div style="background-color: #111; border: 1px solid #222; padding: 30px; border-radius: 4px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; width: 100px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${name}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;"><a href="mailto:${email}" style="color: #fff; text-decoration: none;">${email}</a></td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${phone || '—'}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888;">Service</td><td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${service || '—'}</td></tr>
            </table>
            
            <div style="margin-top: 30px;">
              <p style="color: #888; margin-bottom: 10px; font-size: 14px;">Message</p>
              <div style="background-color: #0a0a0a; padding: 20px; border: 1px solid #222; border-radius: 4px; color: #e0e0e0; font-size: 15px; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 1px;">System Automated Message</p>
          </div>
        </div>
      `,
    });

    // 5. Send Auto-Reply to Customer
    await resend.emails.send({
      from: `Havilah <${fromEmail}>`,
      to: [email],
      subject: 'Thank you for contacting Havilah',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 50px 20px; line-height: 1.8; max-width: 600px; margin: 0 auto; text-align: center;">
          <h1 style="text-transform: uppercase; letter-spacing: 5px; font-size: 24px; font-weight: 300; margin-bottom: 40px; color: #ffffff;">Havilah</h1>
          
          <div style="background-color: #111; border: 1px solid #222; padding: 40px; border-radius: 4px; text-align: left;">
            <p style="font-size: 16px; color: #e0e0e0; margin-top: 0;">Dear ${name},</p>
            <p style="font-size: 15px; color: #a0a0a0;">Thank you for reaching out to us. We have received your enquiry regarding <strong>${service || 'our services'}</strong>.</p>
            <p style="font-size: 15px; color: #a0a0a0;">Our team is currently reviewing your message and will get back to you within 24 hours.</p>
            <p style="font-size: 15px; color: #a0a0a0; margin-bottom: 0;">We look forward to creating something unforgettable together.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #222;">
              <p style="font-size: 14px; color: #e0e0e0; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Havilah Team</p>
            </div>
          </div>
        </div>
      `,
    });

    // 6. Return Success
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('Error sending email via Resend:', error);
    // Never expose internal errors to the user
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
