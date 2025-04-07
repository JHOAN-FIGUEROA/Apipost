// hashearContrasenas.js
const bcrypt = require('bcryptjs');
const { Usuario } = require('./models'); // Asegúrate de que apunta al archivo correcto
const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();

    const usuarios = await Usuario.findAll();

    for (const usuario of usuarios) {
      const passwordActual = usuario.password;

      // Solo hasheamos si aún no lo está
      if (!passwordActual.startsWith('$2a$')) {
        const passwordHasheada = await bcrypt.hash(passwordActual, 10);
        usuario.password = passwordHasheada;
        await usuario.save();
        console.log(`✅ Hasheada contraseña del usuario ID ${usuario.idusuario}`);
      } else {
        console.log(`🔒 Contraseña ya hasheada para usuario ID ${usuario.idusuario}`);
      }
    }

    console.log('✅ Proceso finalizado.');
    process.exit();
  } catch (err) {
    console.error('❌ Error al hashear contraseñas:', err);
    process.exit(1);
  }
})();
