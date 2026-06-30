const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  };

  return nodemailer.createTransport(config);
};

const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info("Email service ready");
    return true;
  } catch (error) {
    logger.error("Email service connection failed:", error.message);
    return false;
  }
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
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>TalishFits</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px 10px !important; }
      .card { border-radius: 12px !important; }
      .body-padding { padding: 24px 20px !important; }
      .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
      .greeting { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #e8ebe5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div class="preheader" style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
  <div style="display: none; max-height: 0; overflow: hidden;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e8ebe5;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="container" style="max-width: 600px; width: 100%;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="card" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td align="center" style="background-color: #0d3d35; padding: 36px 24px;">
                    <h1 style="margin: 0; font-family: Arial Black, Impact, sans-serif; font-size: 26px; font-weight: 900; color: #f5f3ee; letter-spacing: 2px;">TALISHFITS</h1>
                    <p style="margin: 8px 0 0 0; font-size: 10px; color: #c4a87a; letter-spacing: 4px; font-weight: 600;">AI FITNESS COACH</p>
                  </td>
                </tr>
                <tr>
                  <td class="body-padding" style="padding: 40px 32px; color: #1a1a1a;">
                    ${content}
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                <tr>
                  <td align="center" style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #6b7068; line-height: 1.6;">
                    <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} TalishFits. All rights reserved.</p>
                    <p style="margin: 0 0 8px 0;">You're receiving this email because you signed up at TalishFits.</p>
                    <p style="margin: 0;">
                      <a href="${process.env.CLIENT_URL || "https://talishfits.com"}" style="color: #0d3d35; text-decoration: none; font-weight: 600;">Visit Website</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${process.env.CLIENT_URL || "https://talishfits.com"}/privacy" style="color: #0d3d35; text-decoration: none; font-weight: 600;">Privacy</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${process.env.CLIENT_URL || "https://talishfits.com"}/terms" style="color: #0d3d35; text-decoration: none; font-weight: 600;">Terms</a>
                    </p>
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

const sendEmail = async ({ to, subject, html, textContent }) => {
  try {
    const transporter = createTransporter();

    const fromName = process.env.FROM_NAME || "TalishFits";
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const replyTo = process.env.REPLY_TO_EMAIL || fromEmail;

    const text = textContent || htmlToText(html);

    const messageId = generateMessageId(
      fromEmail.split("@")[1] || "talishfits.com",
    );

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text,
      replyTo,
      messageId,
      headers: {
        "X-Mailer": "TalishFits",
        "X-Priority": "3",
        "List-Unsubscribe": `<mailto:${fromEmail}?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        Precedence: "bulk",
        "Auto-Submitted": "auto-generated",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error("Email sending failed:", error.message);
    throw error;
  }
};

const sendOTPEmail = async (user, otp) => {
  const firstName = user.name.split(" ")[0];

  const content = `
    <p class="greeting" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35; letter-spacing: -0.3px;">Hi ${firstName},</p>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      Thanks for signing up for TalishFits. To complete your registration and start your fitness journey, please use the verification code below.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center" style="background-color: #f5f3ee; border: 2px dashed #c4a87a; border-radius: 14px; padding: 28px 20px;">
          <p style="margin: 0 0 12px 0; font-size: 11px; color: #6b7068; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;">Your Verification Code</p>
          <p class="otp-code" style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; color: #0d3d35; letter-spacing: 12px; line-height: 1;">${otp}</p>
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
            <strong>Security note:</strong> Never share this code with anyone. TalishFits will never ask for your verification code via phone or email.
          </p>
        </td>
      </tr>
    </table>

    <hr style="border: 0; height: 1px; background: #e8ebe5; margin: 28px 0;" />

    <p style="margin: 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Didn't sign up for TalishFits? You can safely ignore this email. The code will expire automatically.
    </p>

    <p style="margin: 16px 0 0 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Need help? Just reply to this email — we're here to help.
    </p>
  `;

  const textContent = `
Hi ${firstName},

Thanks for signing up for TalishFits.

Your verification code is: ${otp}

This code expires in 10 minutes.

Enter this code in the verification screen to activate your account.

Security note: Never share this code with anyone. TalishFits will never ask for your verification code via phone or email.

Didn't sign up for TalishFits? You can safely ignore this email.

Need help? Reply to this email.

— The TalishFits Team
${process.env.CLIENT_URL || "https://talishfits.com"}
  `.trim();

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
    <p class="greeting" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35; letter-spacing: -0.3px;">Welcome, ${firstName}.</p>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      Your email is verified and your TalishFits account is ready. You've joined a smart fitness platform built for serious transformation.
    </p>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #2a2a2a; line-height: 1.7;">
      The next step is your health assessment. It takes 2 minutes and unlocks your personalized workout plan, nutrition guide, and progress tracking.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${process.env.CLIENT_URL}/onboarding" style="display: inline-block; padding: 14px 36px; background-color: #0d3d35; color: #f5f3ee; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Start Your Journey</a>
        </td>
      </tr>
    </table>

    <hr style="border: 0; height: 1px; background: #e8ebe5; margin: 28px 0;" />

    <p style="margin: 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Questions? Just reply to this email — we read every message.
    </p>
  `;

  const textContent = `
Welcome, ${firstName}.

Your email is verified and your TalishFits account is ready.

Next step: complete your health assessment to unlock your personalized workout plan, nutrition guide, and progress tracking.

Get started: ${process.env.CLIENT_URL}/onboarding

Questions? Reply to this email.

— The TalishFits Team
  `.trim();

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
    <p class="greeting" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0d3d35; letter-spacing: -0.3px;">Hi ${firstName},</p>

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

    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7068; line-height: 1.6;">
      Or copy this link into your browser:
    </p>
    <p style="margin: 0 0 24px 0; font-size: 12px; color: #0d3d35; word-break: break-all;">
      <a href="${resetUrl}" style="color: #0d3d35;">${resetUrl}</a>
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #fff8ee; border-left: 4px solid #c4823a; border-radius: 6px; padding: 14px 16px;">
          <p style="margin: 0; font-size: 13px; color: #5a3818; line-height: 1.6;">
            <strong>Important:</strong> This link expires in 10 minutes. If you didn't request a password reset, please ignore this email — your password will remain unchanged.
          </p>
        </td>
      </tr>
    </table>
  `;

  const textContent = `
Hi ${firstName},

We received a request to reset your TalishFits password.

Reset your password here: ${resetUrl}

This link expires in 10 minutes.

If you didn't request a password reset, please ignore this email — your password will remain unchanged.

— The TalishFits Team
  `.trim();

  return sendEmail({
    to: user.email,
    subject: "Reset your TalishFits password",
    html: baseTemplate(
      content,
      "Password reset request for your TalishFits account",
    ),
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
