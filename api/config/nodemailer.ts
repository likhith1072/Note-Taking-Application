import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Ensure env vars are typed as strings
const smtpUser = process.env.SMTP_USER as string;
const smtpPass = process.env.SMTP_PASS as string;

if (!smtpUser || !smtpPass) {
  throw new Error("Missing SMTP credentials in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS is not used at port 587 by default
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export default transporter;
