import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === "true", // true for port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * @param {{ to: string, subject: string, html: string }} options
 */
export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "Ecommerce App"}" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
};
