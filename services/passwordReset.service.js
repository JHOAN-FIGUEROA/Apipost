const crypto = require('crypto');
const { Usuario } = require('../models');
const sendEmail = require('../utils/emailSender');


const solicitarRecuperacion = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    throw new Error('No existe un usuario con ese correo');
  }

  // Generar token
  const token = crypto.randomBytes(32).toString('hex');
  const expiracion = new Date(Date.now() + 3600000); // 1 hora

  // Guardar en el usuario
  usuario.token_recuperacion = token;
  usuario.token_expiracion = expiracion;
  await usuario.save();

  // Enlace de recuperación
  const link = `https://apipost-elt2.onrender.com/api/usuarios/restablecer/${token}`;

  // Contenido del correo
  const html = `
    <h2>Recuperación de contraseña</h2>
    <p>Hola ${usuario.nombre},</p>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${link}">${link}</a>
    <p>Este enlace expirará en 1 hora.</p>
  `;

  // Enviar correo
  await sendEmail(usuario.email, 'Recuperar contraseña', html);
};

module.exports = { solicitarRecuperacion };
