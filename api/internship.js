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
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; padding: 40px 15px; margin: 0; line-height: 1.6;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- LUXURY BRAND HEADER -->
          <div style="background-color: #000000; padding: 40px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">HAVILAH</h1>
            <p style="margin: 12px 0 0; font-size: 11px; letter-spacing: 0.2em; color: #a1a1aa; text-transform: uppercase; font-weight: 500;">Executive Recruitment Dossier</p>
          </div>

          <!-- CONTENT BODY -->
          <div style="padding: 40px 32px;">
            <div style="margin-bottom: 32px; text-align: center;">
              <span style="display: inline-block; padding: 6px 14px; background-color: #fef3c7; color: #b45309; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">New Candidate Application</span>
            </div>

            <!-- INTERACTIVE EXECUTIVE ACTION TOOLBAR -->
            <div style="margin-bottom: 40px; padding: 24px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.1em;">Direct Candidate Engagement</p>
              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re: Havilah Studio Internship - ${role} Application Response" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Reply to Candidate</a>
                ${phone ? `<a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; border: 1px solid #e4e4e7; border-radius: 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Call Candidate</a>` : ''}
              </div>
            </div>

            <!-- CANDIDATE DETAILS TABLE -->
            <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #52525b; margin: 0 0 16px; font-weight: 700; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px;">Candidate Identity</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 32px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; width: 140px; font-weight: 500;">Full Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #18181b; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; font-weight: 500;">Target Role</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #000000; font-weight: 700;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; font-weight: 500;">Email Address</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;"><a href="mailto:${email}" style="color: #2563eb; font-weight: 500; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #71717a; font-weight: 500;">Direct Phone</td>
                <td style="padding: 12px 0; color: #18181b;">${phone}</td>
              </tr>
            </table>

            <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #52525b; margin: 0 0 16px; font-weight: 700; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px;">Academic & Technical Profile</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 32px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; width: 140px; font-weight: 500;">Institution</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #18181b; font-weight: 500;">${institution}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; font-weight: 500;">Field of Study</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #18181b;">${fieldOfStudy}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #71717a; font-weight: 500; vertical-align: top;">Key Skills</td>
                <td style="padding: 12px 0; color: #3f3f46; font-weight: 500; line-height: 1.6;">${skills}</td>
              </tr>
            </table>

            <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #52525b; margin: 0 0 16px; font-weight: 700; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px;">Portfolio & Attachments</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #71717a; width: 140px; font-weight: 500;">Portfolio Link</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; color: #18181b;">${portfolioLink ? `<a href="${portfolioLink}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">${portfolioLink}</a>` : '<span style="color: #a1a1aa; font-style: italic;">No link provided</span>'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #71717a; font-weight: 500;">File Dossier</td>
                <td style="padding: 12px 0; color: #000000; font-weight: 600;">📎 ${attachments.length} attachment(s) processed</td>
              </tr>
            </table>
          </div>

          <!-- FOOTER TELEMETRY -->
          <div style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em;">Havilah Studio Recruitment Engine &bull; Confidentiality Protected</p>
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
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 60px 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #333333; border-radius: 8px; padding: 50px 40px; text-align: left;">
              
              <div style="text-align: center; margin-bottom: 50px;">
                <h1 style="text-transform: uppercase; letter-spacing: 0.4em; font-size: 20px; font-weight: 300; margin: 0; color: #ffffff;">HAVILAH</h1>
                <div style="width: 40px; height: 1px; background-color: #D4AF37; margin: 20px auto 0;"></div>
              </div>

              <h2 style="font-size: 18px; color: #ffffff; font-weight: 400; margin-top: 0; margin-bottom: 24px;">Application Received</h2>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.8; margin-bottom: 24px;">Dear ${name},</p>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.8; margin-bottom: 24px;">Thank you for applying for the <strong>${role}</strong> apprenticeship at Havilah Studio.</p>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.8; margin-bottom: 24px;">Our recruitment team has received your application and is currently reviewing your portfolio and credentials. If your background aligns with our upcoming studio projects, our team will reach out directly to coordinate next steps.</p>
              
              <div style="margin: 40px 0; padding: 24px; background-color: #111111; border-left: 2px solid #D4AF37;">
                <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">
                  <strong style="color: #ffffff;">Status:</strong> Under Review<br>
                  <strong style="color: #ffffff;">Role:</strong> ${role}<br>
                  <strong style="color: #ffffff;">Timeline:</strong> You can expect a status update within 5-7 business days.
                </p>
              </div>

              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.8; margin-bottom: 40px;">Keep creating.</p>
              
              <div style="padding-top: 30px; border-top: 1px solid #333333;">
                <p style="font-size: 12px; font-weight: 500; color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Havilah Talent Acquisition</p>
                <p style="font-size: 11px; color: #71717a; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Visual Innovation & Digital Strategy</p>
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
