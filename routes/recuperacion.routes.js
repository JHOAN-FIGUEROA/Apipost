const express = require('express');
const router = express.Router();
const authController = require('../controllers/recuperacion.controlador');

router.post('/solicitar-recuperacion', authController.solicitarRecuperacion);
router.post('/restablecer-contrasena/:token', authController.restablecerContrasena);

module.exports = router;
