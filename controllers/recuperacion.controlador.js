const crypto = require('crypto');
const Usuario = require('../models/usuarios.models');
const sendEmail = require('../utils/emailSender');
const bcrypt = require('bcrypt');


exports.solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Generar token y fecha de expiración
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    usuario.reset_token = token;
    usuario.reset_token_expira = expira;
    await usuario.save();

    // Enviar el correo SOLO a tu email con los datos del usuario
    await sendEmail(
      'Recuperación de contraseña',
      `
        <p><strong>Email real del usuario:</strong> ${email}</p>
        <p>Haz clic en el siguiente enlace para restablecer la contraseña:</p>
        <phref="https://apipost-elt2.onrender.com/restablecer-contrasena/${token}">
          Restablecer contraseña
        <p>
      `
    );

    res.json({
      success: true,
      message: 'Se envió un correo con el enlace para restablecer la contraseña (en modo prueba)',
    });
  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    res.status(500).json({ msg: 'Error al procesar la solicitud' });
  }
};

exports.restablecerContrasena = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        reset_token: token,
        reset_token_expira: { [require('sequelize').Op.gt]: new Date() },
      }
    });

    if (!usuario) {
      return res.status(400).json({ msg: 'Token inválido o expirado' });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    usuario.password = hashedPassword;
    usuario.reset_token = null;
    usuario.reset_token_expira = null;
    await usuario.save();

    res.json({ success: true, message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ msg: 'Error al procesar la solicitud' });
  }
};