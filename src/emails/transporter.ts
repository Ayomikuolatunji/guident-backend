import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.G_MAIL as string,
    pass: process.env.G_MAIL_KEY as string,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
