const { Resend } = require('resend');
const resend = new Resend(process.env.EMAILKY); // tu API Key real

const sendEmail = async (subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'jhoan <onboarding@resend.dev>',
      to: 'jhoan24figueroa@gmail.com', // tu correo fijo
      subject,
      html,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      throw new Error('No se pudo enviar el correo');
    } else {
      console.log('Correo enviado con éxito:', data);
    }
  } catch (err) {
    console.error('Fallo en el envío:', err);
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = sendEmail;
