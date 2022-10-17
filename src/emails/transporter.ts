import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "guident.team@gmail.com",
    pass: "dgvtjoryhgbdndjq",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
