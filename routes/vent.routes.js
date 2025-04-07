const express = require('express');
const router = express.Router();
const {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
  actualizarVenta,
  cambiarEstadoVenta,
  getMisVentas
} = require('../controllers/ventas.controlador');

// Crear nueva venta (estado 3 = "Pedido")
router.post('/', crearVenta);

// Obtener todas las ventas con filtros
router.get('/', obtenerVentas);

router.get('/mis-ventas/:idusuario', getMisVentas);

// Obtener venta específica por ID
router.get('/:id', obtenerVentaPorId);

// Actualizar datos de venta
router.put('/:id', actualizarVenta);

// Cambiar estado de venta
router.patch('/:id/estado', cambiarEstadoVenta);



console.log('✅ Ruta POST registrada en /api/ventas/');
console.log('✅ Ruta GET registrada en /api/ventas/ (con filtros)');
console.log('✅ Ruta GET registrada en /api/ventas/:id');
console.log('✅ Ruta PUT registrada en /api/ventas/:id');
console.log('✅ Ruta PATCH registrada en /api/ventas/:id/estado');

module.exports = router;