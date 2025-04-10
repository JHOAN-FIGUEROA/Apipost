const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controlador');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // almacenamiento temporal

// Rutas
router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', upload.single('imagen'), categoriaController.createCategoria);
router.put('/:id', upload.single('imagen'), categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);
router.get('/:id/productos', categoriaController.getProductosByCategoriaId);

module.exports = router;
