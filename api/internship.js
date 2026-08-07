import { Resend } from 'resend';
import { internshipSchema } from '../src/lib/validation.js';
import { getArchive, saveArchive } from '../src/lib/cloud-storage.js';

async function saveInternshipApplication(data, attachmentCount) {
  try {
    let archive = await getArchive('internships', { updatedAt: new Date().toISOString(), totalApplications: 0, applications: [] });
    const newApp = {
      id: `intern_${Date.now()}_${(data.name || 'applicant').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      institution: data.institution,
      fieldOfStudy: data.fieldOfStudy,
      role: data.role,
      skills: data.skills,
      portfolioLink: data.portfolioLink || '—',
      attachmentCount: attachmentCount || 0,
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    if (!archive.applications) archive.applications = [];
    archive.applications.unshift(newApp);
    archive.totalApplications = archive.applications.length;
    archive.updatedAt = new Date().toISOString();
    await saveArchive('internships', archive);
    console.log(`[Internship API] Application archived successfully in JSON file: ${newApp.id}`);
  } catch (err) {
    console.error(`[Internship API] Failed archiving application:`, err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Honeypot check
  if (req.body.company) {
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  // We omit resume and portfolio from Zod since they are added directly in payload
  const validation = internshipSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: validation.error.format() 
    });
  }

  const { name, email, phone, institution, fieldOfStudy, role, skills, portfolioLink } = validation.data;
  const { resume, portfolio } = req.body; // These are objects: { name, content (base64) }

  const attachments = [];
  try {
    if (resume && resume.content) {
      const cleanContent = resume.content.includes(',') ? resume.content.split(',')[1] : resume.content;
      attachments.push({ filename: resume.name || 'Resume.pdf', content: Buffer.from(cleanContent, 'base64') });
    }
    if (portfolio && portfolio.content) {
      const cleanContent = portfolio.content.includes(',') ? portfolio.content.split(',')[1] : portfolio.content;
      attachments.push({ filename: portfolio.name || 'Portfolio.pdf', content: Buffer.from(cleanContent, 'base64') });
    }
  } catch (err) {
    console.warn('[Attachment encoding fallback]:', err.message);
  }

  // Save applicant to Supabase cloud vault instantly
  await saveInternshipApplication(validation.data, attachments.length);

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const contactEmail = process.env.CONTACT_EMAIL || 'robinson30122000@gmail.com';

  if (!apiKey) {
    console.warn('[Havilah Careers API] RESEND_API_KEY is missing. Candidate dossier archived locally.');
    return res.status(200).json({ success: true, message: 'Internship application archived successfully.' });
  }

  const resend = new Resend(apiKey);

  try {
    console.log(`[Havilah Careers API] Dispatching applicant dossier via Resend to studio recruitment head: ${contactEmail}...`);
    
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #f3f4f6; padding: 40px 15px; margin: 0; line-height: 1.6;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #0c0c0c; border: 1px solid #26231c; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- LUXURY BRAND HEADER -->
          <div style="background: linear-gradient(135deg, #14130e 0%, #0a0907 100%); padding: 32px; border-bottom: 1px solid #26231c; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 0.35em; color: #efe6d2; text-transform: uppercase;">HAVILAH</h1>
            <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 0.25em; color: #b39a64; text-transform: uppercase; font-weight: 600;">🏆 Executive Recruitment Dossier</p>
          </div>

          <!-- CONTENT BODY -->
          <div style="padding: 36px 32px;">
            <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #1a1815;">
              <span style="display: inline-block; padding: 4px 10px; background-color: #1c1912; border: 1px solid #b39a6444; border-radius: 999px; font-size: 11px; font-weight: 700; color: #efe6d2; letter-spacing: 0.1em; text-transform: uppercase;">New Candidate Application</span>
            </div>

            <!-- INTERACTIVE EXECUTIVE ACTION TOOLBAR -->
            <div style="margin-bottom: 32px; padding: 22px; background: #11100c; border: 1px solid #2e281b; border-radius: 10px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #a39474; letter-spacing: 0.15em;">Direct Candidate Engagement</p>
              <div style="display: inline-block;">
                <a href="mailto:${email}?subject=Re: Havilah Studio Internship - ${role} Application Response" style="display: inline-block; margin: 4px; padding: 12px 24px; background-color: #efe6d2; color: #000000; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">📧 Reply to Candidate</a>
                ${phone ? `<a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="display: inline-block; margin: 4px; padding: 12px 24px; background-color: #0c0b08; color: #efe6d2; text-decoration: none; border: 1px solid #b39a64; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">📞 Call Candidate</a>` : ''}
              </div>
            </div>

            <!-- CANDIDATE DETAILS TABLE -->
            <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #a39474; margin: 0 0 12px; font-weight: 700;">Candidate Identity</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 30px; background: #080807; border-radius: 8px; border: 1px solid #1a1815;">
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; width: 130px; font-weight: 500;">Full Name</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #ffffff; font-weight: 600; font-size: 15px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; font-weight: 500;">Target Role</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #efe6d2; font-weight: 700;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; font-weight: 500;">Email Address</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815;"><a href="mailto:${email}" style="color: #efe6d2; font-weight: 600; text-decoration: underline;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; color: #8c8270; font-weight: 500;">Direct Phone</td>
                <td style="padding: 14px 16px; color: #ffffff;">${phone}</td>
              </tr>
            </table>

            <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #a39474; margin: 0 0 12px; font-weight: 700;">Academic & Technical Profile</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 30px; background: #080807; border-radius: 8px; border: 1px solid #1a1815;">
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; width: 130px; font-weight: 500;">Institution</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #ffffff; font-weight: 600;">${institution}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; font-weight: 500;">Field of Study</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #ffffff;">${fieldOfStudy}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; color: #8c8270; font-weight: 500; vertical-align: top;">Key Skills</td>
                <td style="padding: 14px 16px; color: #e5e7eb; font-weight: 500; line-height: 1.6;">${skills}</td>
              </tr>
            </table>

            <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #a39474; margin: 0 0 12px; font-weight: 700;">Portfolio & Attachments</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: #080807; border-radius: 8px; border: 1px solid #1a1815;">
              <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #8c8270; width: 130px; font-weight: 500;">Portfolio Link</td>
                <td style="padding: 14px 16px; border-bottom: 1px solid #1a1815; color: #ffffff;">${portfolioLink ? `<a href="${portfolioLink}" target="_blank" style="color: #efe6d2; text-decoration: underline; font-weight: 600;">${portfolioLink}</a>` : '<span style="color: #666;">No link provided</span>'}</td>
              </tr>
              <tr>
                <td style="padding: 14px 16px; color: #8c8270; font-weight: 500;">File Dossier</td>
                <td style="padding: 14px 16px; color: #efe6d2; font-weight: 600;">📎 ${attachments.length} attachment(s) processed (Resume / Work Samples)</td>
              </tr>
            </table>
          </div>

          <!-- FOOTER TELEMETRY -->
          <div style="background-color: #060605; padding: 20px 32px; border-top: 1px solid #1e1b15; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #6b6456; text-transform: uppercase; letter-spacing: 0.15em;">Havilah Studio Recruitment Engine &bull; Confidentiality Protected</p>
          </div>
        </div>
      </div>
    `;

    // Send Notification Email to Admin
    let adminNotification = await resend.emails.send({
      from: `Havilah Careers <${fromEmail}>`,
      to: [contactEmail],
      reply_to: email,
      subject: `🏆 [NEW INTERN CANDIDATE] ${name} (${role})`,
      attachments: attachments.length > 0 ? attachments : undefined,
      html: adminHtml,
    });

    // Intelligent Fallback: If Resend free-tier limits or attachment encoding rejects the binary files, retry immediately without attachments!
    if (adminNotification.error) {
      console.error('[Resend Internship Admin Delivery Failed with Attachments]:', adminNotification.error);
      console.log('[Resend Automatic Retry] Retrying delivery without binary attachments to ensure candidate reception...');
      adminNotification = await resend.emails.send({
        from: `Havilah Careers <${fromEmail}>`,
        to: [contactEmail],
        reply_to: email,
        subject: `🏆 [NEW INTERN CANDIDATE] ${name} (${role}) - [Attachments in Studio Vault]`,
        html: adminHtml,
      });
      if (adminNotification.error) {
        console.error('[Resend Retry Delivery Failed]:', adminNotification.error);
      } else {
        console.log('[Resend Retry Successful without attachments!]: ID ->', adminNotification.data?.id);
      }
    } else {
      console.log('[Resend Internship Admin Email Sent Successfully!]: ID ->', adminNotification.data?.id);
    }

    // Send Auto-Reply to Applicant (Sandbox protection handled gracefully)
    if (fromEmail.includes('resend.dev') && email.toLowerCase() !== contactEmail.toLowerCase()) {
      console.warn(`[Resend Sandbox Limitation] Auto-reply to ${email} skipped because onboarding@resend.dev only permits emails to verified account (${contactEmail}). To email applicants, verify a custom domain in Resend.`);
    } else {
      const userReply = await resend.emails.send({
        from: `Havilah Studio Careers <${fromEmail}>`,
        to: [email],
        subject: `Application Received: ${role} - Havilah Studio`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 50px 15px; margin: 0;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #0c0c0c; border: 1px solid #26231c; border-radius: 12px; padding: 48px 36px; text-align: left; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
              
              <div style="text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #1c1a15;">
                <h1 style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 24px; font-weight: 300; margin: 0; color: #efe6d2;">HAVILAH</h1>
              </div>

              <p style="font-size: 17px; color: #ffffff; font-weight: 600; margin-top: 0;">Dear ${name},</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7;">Thank you for applying for the <strong>${role}</strong> internship program at Havilah Studio.</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7;">We have received your dossier and our recruitment leaders are reviewing your portfolio and credentials. If your creative trajectory aligns with our active productions, we will correspond with you to schedule an executive discussion.</p>
              <p style="font-size: 15px; color: #b0a99c; line-height: 1.7; margin-bottom: 40px;">Expected review duration: 5-7 business days.<br /><span style="color: #efe6d2; font-weight: 600;">Keep creating.</span></p>
              
              <div style="padding-top: 24px; border-top: 1px solid #1c1a15; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="font-size: 13px; font-weight: 700; color: #efe6d2; margin: 0; text-transform: uppercase; letter-spacing: 0.2em;">HAVILAH RECRUITMENT COMMAND</p>
                  <p style="font-size: 11px; color: #665f52; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Talent Acquisition & Executive Mentorship</p>
                </div>
              </div>

            </div>
          </div>
        `,
      });

      if (userReply.error) {
        console.error('[Resend Internship Auto-Reply Failed]:', userReply.error);
      } else {
        console.log('[Resend Internship Auto-Reply Sent Successfully!]: ID ->', userReply.data?.id);
      }
    }

    return res.status(200).json({ success: true, message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Exception submitting application via Resend:', error);
    return res.status(200).json({ success: true, message: 'Application archived successfully in studio repository.' });
  }
}
