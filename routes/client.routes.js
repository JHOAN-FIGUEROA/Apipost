const express = require('express');
const router = express.Router();
const { createClient, getAllClients, getClientById, updateClient, obtenerPerfilCliente, actualizarPerfilCliente,
    actualizarPasswordCliente
 } = require('../controllers/clientes.controlador');

// Rutas para clientes
router.post("/clientes-crear", createClient);
router.get("/clientes", getAllClients);
router.get('/miperfil/:idusuario',obtenerPerfilCliente);

// Actualizar perfil del cliente
router.put('/miperfil/:idusuario',actualizarPerfilCliente);
router.put('/miperfil/:idusuario/password', actualizarPasswordCliente);
router.get("/clientes/:id", getClientById);  // Corregido el formato del parámetro
router.put("/clientes/:id", updateClient);   // Ruta para actualizar cliente

console.log('✅ Ruta POST registrada en /api/clientes/clientes-crear');
console.log('✅ Ruta GET registrada en /api/clientes/clientes');
console.log('✅ Ruta GET registrada en /api/clientes/clientes/:id');
console.log('✅ Ruta PUT registrada en /api/clientes/clientes/:id');

module.exports = router;