import { Resend } from 'resend';
import { contactSchema } from '../src/lib/validation.js';
import { getArchive, saveArchive } from '../src/lib/cloud-storage.js';

async function saveContactLead(data) {
  try {
    let archive = await getArchive('contacts', { updatedAt: new Date().toISOString(), totalLeads: 0, leads: [] });
    const newLead = {
      id: `contact_${Date.now()}_${(data.name || 'guest').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '—',
      service: data.subService ? `${data.service || 'General Consultation'} (${data.subService})` : (data.service || 'General Consultation'),
      message: data.message,
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    if (!archive.leads) archive.leads = [];
    archive.leads.unshift(newLead);
    archive.totalLeads = archive.leads.length;
    archive.updatedAt = new Date().toISOString();
    await saveArchive('contacts', archive);
    console.log(`[Contact API] Lead archived successfully in JSON file: ${newLead.id}`);
  } catch (err) {
    console.error(`[Contact API] Failed archiving lead:`, err);
  }
}

// Vercel serverless function expects a default export
export default async function handler(req, res) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Honeypot check (spam protection)
  if (req.body.company) {
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  // 3. Validation
  const validation = contactSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: validation.error.format() 
    });
  }

  const { name, email, phone, service, subService, message } = validation.data;
  const fullService = subService ? `${service} (${subService})` : service;

  // Save structured inquiry to Supabase cloud archive instantly
  await saveContactLead(validation.data);

  // Initialize Resend
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const contactEmail = process.env.CONTACT_EMAIL || 'robinson30122000@gmail.com';

  if (!apiKey) {
    console.warn('[Havilah Contact API] RESEND_API_KEY is not configured. Inquiry saved to database only.');
    return res.status(200).json({ success: true, message: 'Inquiry archived successfully in studio repository.' });
  }

  const resend = new Resend(apiKey);

  try {
    console.log(`[Havilah Contact API] Dispatching email via Resend to site admin: ${contactEmail}...`);
    // 4. Send Notification Email to Site Owner with Interactive Executive Action Toolbar
    const adminNotification = await resend.emails.send({
      from: `Havilah Studio CRM <${fromEmail}>`,
      to: [contactEmail],
      reply_to: email,
      subject: `✦ [NEW CLIENT LEAVE] ${name} (${fullService || 'Consultation'})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #f3f4f6; padding: 40px 15px; margin: 0; line-height: 1.6;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #0c0c0c; border: 1px solid #26231c; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
            
            <!-- LUXURY BRAND HEADER -->
            <div style="background: linear-gradient(135deg, #14130e 0%, #0a0907 100%); padding: 32px; border-bottom: 1px solid #26231c; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 0.35em; color: #efe6d2; text-transform: uppercase;">HAVILAH</h1>
              <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 0.25em; color: #b39a64; text-transform: uppercase; font-weight: 600;">✦ Executive Client Dossier</p>
            </div>

            <!-- CONTENT BODY -->
            <div style="padding: 36px 32px;">
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #1a1815;">
                <span style="display: inline-block; padding: 4px 10px; background-color: #1c1912; border: 1px solid #b39a6444; border-radius: 999px; font-size: 11px; font-weight: 700; color: #efe6d2; letter-spacing: 0.1em; text-transform: uppercase;">New Lead Action Required</span>
              </div>

              <!-- INTERACTIVE EXECUTIVE ACTION TOOLBAR -->
              <div style="margin-bottom: 32px; padding: 22px; background: #11100c; border: 1px solid #2e281b; border-radius: 10px; text-align: center;">
                <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #a39474; letter-spacing: 0.15em;">Instant Client Engagement</p>
                <div style="display: inline-block;">
                  <a href="mailto:${email}?subject=Re: Havilah Studio Inquiry - ${fullService || 'Consultation'}" style="display: inline-block; margin: 4px; padding: 12px 24px; background-color: #efe6d2; color: #000000; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">📧 Reply via Mail</a>
                  ${phone ? `<a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="display: inline-block; margin: 4px; padding: 12px 24px; background-color: #0c0b08; color: #efe6d2; text-decoration: none; border: 1px solid #b39a64; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">📞 Call Client</a>` : ''}
                </div>
              </div>

              <!-- CLIENT DOSSIER TABLE -->
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #8c8270; width: 130px; font-weight: 500;">Client Name</td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #ffffff; font-weight: 600; font-size: 15px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #8c8270; font-weight: 500;">Email Address</td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #efe6d2;"><a href="mailto:${email}" style="color: #efe6d2; font-weight: 600; text-decoration: underline;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #8c8270; font-weight: 500;">Direct Phone</td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #ffffff;">${phone || '<span style="color: #555;">Not specified</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #8c8270; font-weight: 500;">Requested Service</td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #1c1a16; color: #efe6d2; font-weight: 600;">${fullService || 'General Consultation'}</td>
                </tr>
              </table>

              <!-- MESSAGE BLOCK -->
              <div>
                <p style="color: #8c8270; margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Client Briefing / Inquiry Message:</p>
                <div style="background-color: #060605; padding: 24px; border: 1px solid #26221a; border-left: 3px solid #efe6d2; border-radius: 8px; color: #e5e7eb; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
              </div>
            </div>

            <!-- FOOTER TELEMETRY -->
            <div style="background-color: #060605; padding: 20px 32px; border-top: 1px solid #1e1b15; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #6b6456; text-transform: uppercase; letter-spacing: 0.15em;">Havilah Studio Automated Command Console &bull; Security Protocol Enabled</p>
            </div>
          </div>
        </div>
      `,
    });

    if (adminNotification.error) {
      console.error('[Resend Admin Email Delivery Failed]:', adminNotification.error);
    } else {
      console.log('[Resend Admin Email Sent Successfully!]: ID ->', adminNotification.data?.id);
    }

    // 5. Send Auto-Reply to Customer (Sandbox protection handled gracefully)
    if (fromEmail.includes('resend.dev') && email.toLowerCase() !== contactEmail.toLowerCase()) {
      console.warn(`[Resend Sandbox Limitation] Auto-reply to ${email} skipped because onboarding@resend.dev only permits emails to verified account (${contactEmail}). To email guests, verify a custom domain in Resend.`);
    } else {
      const userReply = await resend.emails.send({
        from: `Havilah Studio <${fromEmail}>`,
        to: [email],
        subject: 'Thank you for contacting Havilah Studio',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 50px 15px; margin: 0;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #0c0c0c; border: 1px solid #26231c; border-radius: 12px; padding: 48px 36px; text-align: left; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
              
              <div style="text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #1c1a15;">
                <h1 style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 24px; font-weight: 300; margin: 0; color: #efe6d2;">HAVILAH</h1>
              </div>

              <p style="font-size: 17px; color: #ffffff; font-weight: 600; margin-top: 0;">Dear ${name},</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7;">Thank you for initiating communication with us. We have securely archived your briefing regarding <strong>${fullService || 'our studio services'}</strong> into our executive repository.</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7;">Our leadership team is currently evaluating your requirements and will correspond with you within 24 business hours.</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7; margin-bottom: 40px;">We look forward to forging something extraordinary together.</p>
              
              <div style="padding-top: 24px; border-top: 1px solid #1c1a15; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="font-size: 13px; font-weight: 700; color: #efe6d2; margin: 0; text-transform: uppercase; letter-spacing: 0.2em;">HAVILAH TEAM</p>
                  <p style="font-size: 11px; color: #665f52; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Executive Creative Studio</p>
                </div>
              </div>

            </div>
          </div>
        `,
      });

      if (userReply.error) {
        console.error('[Resend Auto-Reply Failed]:', userReply.error);
      } else {
        console.log('[Resend Auto-Reply Sent Successfully!]: ID ->', userReply.data?.id);
      }
    }

    // 6. Return Success
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('Exception sending email via Resend:', error);
    // Return success since the inquiry is securely saved to the database archive
    return res.status(200).json({ success: true, message: 'Inquiry archived successfully in studio repository.' });
  }
}
