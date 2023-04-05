import nodemailer from 'nodemailer/lib/nodemailer.js';

export async function sendMail(to, subject, html) {
  console.log(process.env.SMTP_HOST);
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: JSON.parse(process.env.SMTP_SECURE),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);
}
