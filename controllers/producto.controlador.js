const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const sequelize = require('../config/database');
const defineProducto = require('../models/producto.models');
const { Op } = require('sequelize');
const Producto = defineProducto(sequelize, require('sequelize').DataTypes);
const Categoria = require('../models/categoria.models');

// Obtener todos los productos con búsqueda por nombre
exports.obtenerProductos = async (req, res) => {
  try {
    const { search = '' } = req.query;

    const productos = await Producto.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};

// Crear producto con imagen y stock
exports.crearProducto = async (req, res) => {
  try {
    let imagenUrl = null;

    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, {
        folder: 'productos',
      });
      imagenUrl = resultado.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Validación básica para stock
    const { stock } = req.body;
    if (stock === undefined || isNaN(parseInt(stock))) {
      return res.status(400).json({ error: 'Stock es obligatorio y debe ser un número' });
    }

    const nuevoProducto = await Producto.create({
      ...req.body,
      stock: parseInt(stock),
      imagen: imagenUrl,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(400).json({ error: 'Error al crear producto', detalles: error.message });
  }
};

// Actualizar producto con imagen y stock
exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    let imagenUrl = producto.imagen;
    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, {
        folder: 'productos',
      });
      imagenUrl = resultado.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Si se envía stock, asegúrate de que sea numérico
    const updateData = {
      ...req.body,
      imagen: imagenUrl,
    };

    if (req.body.stock !== undefined) {
      const stock = parseInt(req.body.stock);
      if (isNaN(stock)) {
        return res.status(400).json({ error: 'Stock debe ser un número' });
      }
      updateData.stock = stock;
    }

    await producto.update(updateData);

    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).json({ error: 'Error al actualizar producto', detalles: error.message });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

Producto.associate = (models) => {
  Producto.belongsTo(models.Categoria, {
    foreignKey: 'idcategoria',
    as: 'categoria'
  });
};

exports.getProductosByCategoriaId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [{
        model: Producto,
        as: 'productos'
      }]
    });

    console.log('Categoria:', categoria);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
        code: "NO_ENCONTRADA"
      });
    }

    res.json({
      success: true,
      data: categoria.productos
    });
  } catch (error) {
    console.error("Error en getProductosByCategoriaId:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos de la categoría",
      code: "ERROR_CONSULTA"
    });
  }
};
