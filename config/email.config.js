const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "89b507001@smtp-brevo.com", // Tu correo Brevo
    pass: "FCM43bmkzHAcnfQG" // Tu clave SMTP
  }
});

module.exports = transporter;
