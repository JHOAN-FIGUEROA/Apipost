const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL establecida correctamente.'))
  .catch(err => console.error('❌ Error de conexión a MySQL:', err));
