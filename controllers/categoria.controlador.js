const { Op } = require('sequelize');
const Categoria = require('../models/categoria.models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const Producto = require('../models/producto.models');

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let imagenUrl = null;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio",
        code: "NOMBRE_FALTANTE"
      });
    }

    // Subir imagen a Cloudinary si se envía
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categorias'
      });
      imagenUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // eliminar archivo local temporal
    }

    const categoria = await Categoria.create({
      nombre,
      descripcion: descripcion || null,
      estado: 1,
      imagen: imagenUrl
    });

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: categoria
    });
  } catch (error) {
    console.error("Error en createCategoria:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear categoría",
      code: "ERROR_INTERNO",
      error: error.message
    });
  }
};

// Obtener todas las categorías con paginación y búsqueda
const getAllCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', estado = '' } = req.query;

    const options = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      where: {}
    };

    if (search) {
      options.where.nombre = { [Op.iLike]: `%${search}%` };
    }

    if (estado !== '') {
      options.where.estado = estado;
    }

    const { count, rows } = await Categoria.findAndCountAll(options);

    res.json({
      success: true,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      },
      data: rows
    });
  } catch (error) {
    console.error('Error en getAllCategorias:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      code: "DB_QUERY_ERROR"
    });
  }
};

// Obtener categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
        code: "NO_ENCONTRADA"
      });
    }

    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error("Error en getCategoriaById:", error);
    res.status(500).json({
      success: false,
      message: "Error al consultar categoría",
      code: "ERROR_CONSULTA"
    });
  }
};

// Actualizar categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
        code: "NO_ENCONTRADA"
      });
    }

    // Validar estado
    if (estado !== undefined && ![0, 1].includes(parseInt(estado))) {
      return res.status(400).json({
        success: false,
        message: "Estado debe ser 0 (inactivo) o 1 (activo)",
        code: "ESTADO_INVALIDO"
      });
    }

    // Subir nueva imagen si se manda
    let nuevaImagen = categoria.imagen;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categorias'
      });
      nuevaImagen = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
      estado: estado !== undefined ? estado : categoria.estado,
      imagen: nuevaImagen
    });

    res.json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoria
    });
  } catch (error) {
    console.error("Error en updateCategoria:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar categoría",
      code: "ERROR_ACTUALIZACION",
      error: error.message
    });
  }
};

// Eliminar categoría (cambio de estado)
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
        code: "NO_ENCONTRADA"
      });
    }

    await categoria.update({ estado: 0 });

    res.json({
      success: true,
      message: "Categoría desactivada exitosamente"
    });
  } catch (error) {
    console.error("Error en deleteCategoria:", error);
    res.status(500).json({
      success: false,
      message: "Error al desactivar categoría",
      code: "ERROR_ELIMINACION"
    });
  }
};

// Obtener productos por ID de categoría
const getProductosByCategoriaId = async (req, res) => {
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

module.exports = {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
  getProductosByCategoriaId
};
