// mailer.js (o al inicio del archivo)
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que uses
  auth: {
    user: 'jhoan24figueroa@gmail.com',
    pass: '1011395174S'
  }
});

const enviarCorreoConfirmacion = async (destinatario, nombre) => {
  const mailOptions = {
    from: 'jhoan24figueroa@gmail.com',
    to: destinatario,
    subject: '¡Bienvenido a la plataforma De Postwaret Mobile!',
    html: `
      <h2>Hola ${nombre},</h2>
      <p>Tu registro se ha realizado correctamente.</p>
      <p>¡Gracias por unirte a nosotros!</p>
    `
  };

  return transporter.sendMail(mailOptions);
};
