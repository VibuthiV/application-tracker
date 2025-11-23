// server/utils/email.js
import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;

let transporter = null;

if (user && pass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
} else {
  console.warn(
    "[JobTrackr] GMAIL_USER or GMAIL_PASS not set – email sending will be disabled."
  );
}

/**
 * Send a simple email (text or HTML).
 * If email isn't configured, it will just log and return.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.log(
      "[JobTrackr] Email not configured. Skipping send to:",
      to,
      "subject:",
      subject
    );
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || user,
    to,
    subject,
    text,
    html: html || (text ? `<p>${text}</p>` : undefined),
  };

  await transporter.sendMail(mailOptions);
};
