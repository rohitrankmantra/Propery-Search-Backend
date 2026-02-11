import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your gmail
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

export default transporter;
