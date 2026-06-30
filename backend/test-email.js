require("dotenv").config();
const nodemailer = require("nodemailer");

const test = async () => {
  console.log("\n=== EMAIL TEST ===\n");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log(
    "SMTP_PASS:",
    process.env.SMTP_PASS
      ? `${process.env.SMTP_PASS.substring(0, 4)}... (${process.env.SMTP_PASS.length} chars)`
      : "NOT SET",
  );
  console.log("FROM_EMAIL:", process.env.FROM_EMAIL);
  console.log("");

  if (!process.env.SMTP_PASS) {
    console.error("ERROR: SMTP_PASS is empty in .env file");
    process.exit(1);
  }

  if (process.env.SMTP_PASS.length !== 16) {
    console.warn(
      "WARNING: Gmail app passwords are exactly 16 characters. Yours is",
      process.env.SMTP_PASS.length,
      "chars.",
    );
    console.warn("Make sure you removed all spaces from the password.\n");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log("Step 1: Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("SUCCESS: Connection verified\n");
  } catch (err) {
    console.error("FAILED: Connection error");
    console.error("Error:", err.message);
    console.error("\nCommon causes:");
    console.error("1. Wrong app password (must be 16 chars, no spaces)");
    console.error("2. 2-Step Verification not enabled on Gmail");
    console.error("3. App password was revoked");
    console.error("4. Less Secure Apps blocked (use App Password instead)");
    process.exit(1);
  }

  const testEmail = process.argv[2] || process.env.SMTP_USER;

  console.log(`Step 2: Sending test email to ${testEmail}...`);

  try {
    const info = await transporter.sendMail({
      from: `"TalishFits" <${process.env.FROM_EMAIL}>`,
      to: testEmail,
      subject: "TalishFits Test Email",
      text: "If you can read this, your email setup is working correctly.",
      html: `
        <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d3d35;">Test Email Successful</h1>
          <p>If you can read this in your INBOX (not spam), your TalishFits email setup is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("SUCCESS: Email sent");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log(`\nNow check ${testEmail}:`);
    console.log("1. Check INBOX");
    console.log("2. Check SPAM folder");
    console.log("3. Check All Mail (Gmail sidebar)");
    console.log("4. Search Gmail for: from:" + process.env.FROM_EMAIL);
    console.log(
      '\nIf email is in Spam, mark it "Not Spam" to fix future emails.',
    );
  } catch (err) {
    console.error("FAILED to send email");
    console.error("Error:", err.message);
  }
};

test();
