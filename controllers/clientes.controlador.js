const { Op } = require('sequelize');
const Cliente = require('../models/cliente.model');
const { Usuario } = require('../models'); 
const bcrypt = require('bcryptjs');

// Crear cliente (estado = 1 "activo" por defecto)
const createClient = async (req, res) => {
  try {
    const { documentocliente, nombre, apellido, email, numerocontacto } = req.body;

    // Validar campos obligatorios
    if (!documentocliente || !nombre || !apellido || !numerocontacto) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: documentocliente, nombre, apellido o teléfono",
        code: "CAMPOS_FALTANTES"
      });
    }

    // Validar formato del teléfono
    if (!/^\d{10}$/.test(numerocontacto)) {
      return res.status(400).json({
        success: false,
        message: "El teléfono debe tener 10 dígitos",
        code: "TELEFONO_INVALIDO"
      });
    }

    // Crear cliente (con estado 1 por defecto)
    const cliente = await Cliente.create({
      documentocliente,
      nombre,
      apellido,
      email: email || null,
      numerocontacto,
      estado: 1 // <- Estado activo por defecto
    });

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: cliente
    });

  } catch (error) {
    console.error("Error en createClient:", error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: "El documento de cliente ya existe",
        code: "CLIENTE_DUPLICADO"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno al crear cliente",
      code: "ERROR_INTERNO",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener todos los clientes (paginado y búsqueda)
const getAllClients = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      estado = '',
      sort = 'nombre',
      order = 'ASC'
    } = req.query;

    const options = {
      attributes: ['documentocliente', 'nombre', 'apellido', 'email', 'numerocontacto', 'estado'],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sort, order]],
      where: {}
    };

    // Búsqueda por nombre, apellido, teléfono o documento
    if (search) {
      options.where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { apellido: { [Op.iLike]: `%${search}%` } },
        { numerocontacto: { [Op.like]: `%${search}%` } },
        { documentocliente: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtrar por estado (0=inactivo, 1=activo)
    if (estado !== '') {
      options.where.estado = estado;
    }

    const { count, rows } = await Cliente.findAndCountAll(options);

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
    console.error('Error en getAllClients:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener clientes",
      code: "DB_QUERY_ERROR"
    });
  }
};

// Obtener cliente por documento
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Documento de cliente no proporcionado",
        code: "DOCUMENTO_INVALIDO"
      });
    }

    const cliente = await Cliente.findOne({
      where: { documentocliente: id },
      attributes: ['documentocliente', 'nombre', 'apellido', 'email', 'numerocontacto', 'estado']
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
        code: "NO_ENCONTRADO"
      });
    }

    res.json({
      success: true,
      data: cliente
    });

  } catch (error) {
    console.error("Error en getClientById:", error);
    res.status(500).json({
      success: false,
      message: "Error al consultar cliente",
      code: "ERROR_CONSULTA"
    });
  }
};

// Actualizar cliente
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, numerocontacto, estado } = req.body;

    const cliente = await Cliente.findOne({ where: { documentocliente: id } });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
        code: "NO_ENCONTRADO"
      });
    }

    // Validar formato del teléfono si se envía
    if (numerocontacto && !/^\d{10}$/.test(numerocontacto)) {
      return res.status(400).json({
        success: false,
        message: "El teléfono debe tener 10 dígitos",
        code: "TELEFONO_INVALIDO"
      });
    }

    // Validar estado (0 o 1) si se envía
    if (estado !== undefined && ![0, 1].includes(parseInt(estado))) {
      return res.status(400).json({
        success: false,
        message: "Estado debe ser 0 (inactivo) o 1 (activo)",
        code: "ESTADO_INVALIDO"
      });
    }

    // Actualizar solo campos proporcionados
    await cliente.update({
      nombre: nombre || cliente.nombre,
      apellido: apellido || cliente.apellido,
      email: email !== undefined ? email : cliente.email,
      numerocontacto: numerocontacto || cliente.numerocontacto,
      estado: estado !== undefined ? estado : cliente.estado
    });

    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: cliente
    });

  } catch (error) {
    console.error("Error en updateClient:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar cliente",
      code: "ERROR_ACTUALIZACION"
    });
  }
};


const obtenerPerfilCliente = async (req, res) => {
  const { idusuario } = req.params;

  try {
    const cliente = await Cliente.findOne({
      where: { usuario_idusuario: idusuario }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener perfil del cliente:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


const actualizarPerfilCliente = async (req, res) => {
  const { idusuario } = req.params;

  try {
    const cliente = await Cliente.findOne({
      where: { usuario_idusuario: idusuario }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const { nombre, apellido, numerocontacto, email } = req.body;

    await cliente.update({
      nombre,
      apellido,
      numerocontacto,
      email
    });

    res.json({ mensaje: 'Perfil actualizado correctamente', cliente });
  } catch (error) {
    console.error('Error al actualizar perfil del cliente:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};



const actualizarPasswordCliente = async (req, res) => {
  const { idusuario } = req.params;
  const { contraseñaActual, nuevaContraseña } = req.body;

  try {
    if (!contraseñaActual || !nuevaContraseña) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const usuario = await Usuario.findByPk(idusuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contraseñaActual, usuario.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    const nuevaPasswordHash = await bcrypt.hash(nuevaContraseña, 10);
    usuario.password = nuevaPasswordHash;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  obtenerPerfilCliente,
  actualizarPerfilCliente,
  actualizarPasswordCliente
  
};