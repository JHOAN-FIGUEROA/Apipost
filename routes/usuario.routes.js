const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controlador');

// POST: Registrar usuario y cliente automáticamente
router.post('/registrar', usuarioController.registrarUsuario);
router.post('/login', usuarioController.iniciarSesion);
module.exports = router;
