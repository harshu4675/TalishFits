const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const useResendAPI = !!process.env.RESEND_API_KEY;

const resend = useResendAPI ? new Resend(process.env.RESEND_API_KEY) : null;

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false, minVersion: "TLSv1.2" },
    pool: true,
    maxConnections: 5,
  });
};

const generateMessageId = (domain = "talishfits.com") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `<${timestamp}.${random}@${domain}>`;
};

const baseTemplate = (
  content,
  preheader = "",
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TalishFits</title>
</head>
<body style="margin: 0; padding: 0; background-color: #e8ebe5; font-family: Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e8ebe5;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td align="center" style="background-color: #0d3d35; padding: 36px 24px;">
                    <h1 style="margin: 0; font-family: Arial Black, Impact, sans-serif; font-size: 26px; font-weight: 900; color: #f5f3ee; letter-spacing: 2px;">TALISHFITS</h1>
                    <p style="margin: 8px 0 0 0; font-size: 10px; color: #c4a87a; letter-spacing: 4px; font-weight: 600;">AI FITNESS COACH</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px; color: #1a1a1a;">
                    ${content}
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                <tr>
                  <td align="center" style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #6b7068; line-height: 1.6;">
                    <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} TalishFits. All rights reserved.</p>
                    <p style="margin: 0;">You're receiving this because you signed up at TalishFits.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const htmlToText = (html) => {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const sendEmailViaSMTP = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const fromName = process.env.FROM_NAME || "TalishFits";
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
    replyTo: process.env.REPLY_TO_EMAIL || fromEmail,
    messageId: generateMessageId(),
    headers: {
      "X-Mailer": "TalishFits",
      "List-Unsubscribe": `<mailto:${fromEmail}?subject=Unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  return { success: true, messageId: info.messageId };
};

const sendEmailViaResendAPI = async ({ to, subject, html, text }) => {
  const fromName = process.env.FROM_NAME || "TalishFits";
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  const result = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject,
    html,
    text,
    reply_to: process.env.REPLY_TO_EMAIL || fromEmail,
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend API error");
  }

  return { success: true, messageId: result.data?.id };
};

const sendEmail = async ({ to, subject, html, textContent }) => {
  try {
    const text = textContent || htmlToText(html);

    let result;
    if (useResendAPI) {
      logger.info(`Sending email via Resend API to ${to}`);
      result = await sendEmailViaResendAPI({ to, subject, html, text });
    } else {
      logger.info(`Sending email via SMTP to ${to}`);
      result = await sendEmailViaSMTP({ to, subject, html, text });
    }

    logger.info(`Email sent to ${to}: ${result.messageId}`);
    return result;
  } catch (error) {
    logger.error("Email sending failed:", error.message);
    throw error;
  }
};

const verifyConnection = async () => {
  if (useResendAPI) {
    logger.info("Email service: Resend API (HTTPS)");
    return true;
  }
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info("Email service: SMTP ready");
    return true;
  } catch (error) {
    logger.error("SMTP connection failed:", error.message);
    return false;
  }
};

const sendOTPEmail = async (user, otp) => {
  const firstName = user.name.split(" ")[0];

  const content = `
    <p style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35;">Hi ${firstName},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      Thanks for signing up for TalishFits. Use this verification code to complete your registration.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center" style="background-color: #f5f3ee; border: 2px dashed #c4a87a; border-radius: 14px; padding: 28px 20px;">
          <p style="margin: 0 0 12px 0; font-size: 11px; color: #6b7068; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;">Your Verification Code</p>
          <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 42px; font-weight: 900; color: #0d3d35; letter-spacing: 12px; line-height: 1;">${otp}</p>
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7068;">Expires in 10 minutes</p>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 20px 0; font-size: 14px; color: #2a2a2a; line-height: 1.7;">
      Enter this code in the verification screen to activate your account.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #fff8ee; border-left: 4px solid #c4823a; border-radius: 6px; padding: 14px 16px;">
          <p style="margin: 0; font-size: 13px; color: #5a3818; line-height: 1.6;">
            <strong>Security note:</strong> Never share this code with anyone. TalishFits will never ask for your code via phone or email.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Didn't sign up for TalishFits? Ignore this email — the code will expire automatically.
    </p>
  `;

  const textContent = `Hi ${firstName},

Thanks for signing up for TalishFits.

Your verification code is: ${otp}

This code expires in 10 minutes.

Enter this code in the verification screen to activate your account.

Security note: Never share this code with anyone.

Didn't sign up? You can safely ignore this email.

— The TalishFits Team`;

  return sendEmail({
    to: user.email,
    subject: `${otp} is your TalishFits verification code`,
    html: baseTemplate(
      content,
      `Your verification code is ${otp}. Valid for 10 minutes.`,
    ),
    textContent,
  });
};

const sendWelcomeEmail = async (user) => {
  const firstName = user.name.split(" ")[0];

  const content = `
    <p style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35;">Welcome, ${firstName}.</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      Your email is verified and your TalishFits account is ready. You've joined a smart fitness platform built for serious transformation.
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      Next step: complete your health assessment to unlock your personalized workout plan and nutrition guide.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${process.env.CLIENT_URL}/onboarding" style="display: inline-block; padding: 14px 36px; background-color: #0d3d35; color: #f5f3ee; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Start Your Journey</a>
        </td>
      </tr>
    </table>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Questions? Reply to this email — we read every message.
    </p>
  `;

  const textContent = `Welcome, ${firstName}.

Your TalishFits account is verified and ready.

Next step: complete your health assessment at ${process.env.CLIENT_URL}/onboarding

Questions? Reply to this email.

— The TalishFits Team`;

  return sendEmail({
    to: user.email,
    subject: "Welcome to TalishFits — your account is ready",
    html: baseTemplate(
      content,
      "Your TalishFits account is verified and ready",
    ),
    textContent,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const firstName = user.name.split(" ")[0];
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const content = `
    <p style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35;">Hi ${firstName},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      We received a request to reset your TalishFits password. Click the button below to create a new password.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 36px; background-color: #0d3d35; color: #f5f3ee; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Reset Password</a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7068;">Or copy this link:</p>
    <p style="margin: 0 0 24px 0; font-size: 12px; color: #0d3d35; word-break: break-all;">
      <a href="${resetUrl}" style="color: #0d3d35;">${resetUrl}</a>
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #fff8ee; border-left: 4px solid #c4823a; border-radius: 6px; padding: 14px 16px;">
          <p style="margin: 0; font-size: 13px; color: #5a3818; line-height: 1.6;">
            <strong>Important:</strong> This link expires in 10 minutes. If you didn't request a password reset, ignore this email.
          </p>
        </td>
      </tr>
    </table>
  `;

  const textContent = `Hi ${firstName},

We received a request to reset your TalishFits password.

Reset your password: ${resetUrl}

This link expires in 10 minutes.

If you didn't request this, ignore this email.

— The TalishFits Team`;

  return sendEmail({
    to: user.email,
    subject: "Reset your TalishFits password",
    html: baseTemplate(content, "Password reset for your TalishFits account"),
    textContent,
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  verifyConnection,
};
