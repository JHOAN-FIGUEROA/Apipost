const express = require('express');
const app = express();
const sequelize = require('./config/database');



// Middlewares CRUCIALES (en ESTE orden)
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true }));


// Conectar a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      return sequelize.sync({ alter: true });
    }
  })
  .then(() => {
    console.log('🔄 Modelos sincronizados');
    // Iniciar servidor
    app.listen(3000, () => {
      console.log('🚀 Servidor iniciado en http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    process.exit(1);
  });





  // ... después de otras rutas
  
  
  // Importa rutas DESPUÉS de los middlewares

  const categoriaRoutes = require('./routes/categoria.routes');

  const clientRoutes = require('./routes/client.routes');
  
  const ventasRouter = require('./routes/vent.routes');
  
  const productoRoutes = require('./routes/producto.routes');

  const usuarioRoutes = require('./routes/usuario.routes');

  
const recuperacionRoutes = require('./routes/recuperacion.routes');


app.use('/api/usuarios', recuperacionRoutes);
  
  
  // Registra rutas
  app.use('/api/categorias', categoriaRoutes);
  app.use('/api/clientes', clientRoutes);
  app.use('/api/ventas', ventasRouter);
  app.use('/api/productos', productoRoutes);
  app.use('/api/usuarios', usuarioRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Error interno' });
});

// Inicia servidor
sequelize.sync().then(() => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`
    🚀 Servidor listo en http://localhost:${PORT}
    📌 Rutas activas:
       POST /api/clientes/clientes-crear
       GET  /api/clientes/
       GET  /clientes/:id"
       PUT /clientes/:id" 
    `);
  });
});
