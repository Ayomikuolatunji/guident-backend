import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID;
const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

export const auth2 = new google.auth.OAuth2(
  GOOGLE_CLIENTID,
  GOOGLE_SECRET_KEY,
  GOOGLE_REDIRECT_URL
);

auth2.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const transporter = async () => {
  const accessToken = await auth2.getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.G_MAIL as string,
      clientId: GOOGLE_CLIENTID as string,
      clientSecret: GOOGLE_SECRET_KEY as string,
      refreshToken: GOOGLE_REFRESH_TOKEN as string,
      accessToken: accessToken as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export default transporter;
