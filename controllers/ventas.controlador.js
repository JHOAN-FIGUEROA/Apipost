const db = require('../models');
const { sequelize, Venta, VentaProducto, Producto, Cliente } = db;


/**
 * @desc    Crear nueva venta (estado 3 = "Pedido" por defecto)
 * @route   POST /api/ventas
 * @access  Privado
 */
const crearVenta = async (req, res) => {
  const t = await sequelize.transaction(); // Transacción

  try {
    const { documentocliente, total, productos } = req.body;

    // Crear la venta
    const venta = await Venta.create({
      documentocliente,
      total,
      estdo: 3
    }, { transaction: t });

    // Insertar productos en ventaproducto y actualizar stock
    for (const item of productos) {
      const { idproducto, cantidad, precioventa } = item;
      const subtotal = cantidad * precioventa;

      // Verificar stock suficiente
      const producto = await Producto.findByPk(idproducto);
      if (!producto || producto.stock < cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${idproducto}`);
      }

      // Registrar en ventaproducto
      await VentaProducto.create({
        idproducto,
        idventa: venta.idventas,
        cantidad,
        precioventa,
        subtotal
      }, { transaction: t });

      // Actualizar stock del producto
      await producto.update({
        stock: producto.stock - cantidad
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: {
        idventa: venta.idventas,
        productos,
        total
      }
    });

  } catch (error) {
    await t.rollback();
    console.error("Error en crearVenta:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear la venta",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * @desc    Obtener todas las ventas con filtros
 * @route   GET /api/ventas
 * @access  Privado
 */
const obtenerVentas = async (req, res) => {
    try {
      const { documentocliente, estado, fechaDesde, fechaHasta } = req.query;
      
      const where = {};
      
      // Construcción de filtros
      if (documentocliente) {
        where.documentocliente = documentocliente;
      }
      
      if (estado) {
        where.estdo = estado;
      }
      
      if (fechaDesde && fechaHasta) {
        where.fechaventa = {
          [Op.between]: [
            new Date(fechaDesde),
            new Date(fechaHasta)
          ]
        };
      }
  
      const ventas = await Venta.findAll({
        where,
        include: [{
          association: 'cliente',
          attributes: ['nombre', 'apellido']
        }],
        order: [['fechaventa', 'DESC']]
      });
  
      if (!ventas || ventas.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "No se encontraron ventas con los filtros aplicados"
        });
      }
  
      res.json({
        success: true,
        count: ventas.length,
        data: ventas
      });
  
    } catch (error) {
      console.error('Error detallado en obtenerVentas:', {
        message: error.message,
        stack: error.stack,
        queryParams: req.query
      });
      
      res.status(500).json({
        success: false,
        message: "Error en el servidor al obtener ventas",
        code: "DB_QUERY_ERROR",
        systemError: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          sql: error.sql
        } : undefined
      });
    }
  };
/**
 * @desc    Obtener venta por ID
 * @route   GET /api/ventas/:id
 * @access  Privado
 */
const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'numerocontacto']
        },
        {
          model: VentaProducto,
          as: 'productos',
          include: [{
            model: Producto,
            as: 'producto',
            attributes: ['nombre', 'detalleproducto', 'precioventa']
          }]
        }
      ]
    });

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada"
      });
    }

    res.json({
      success: true,
      data: venta
    });

  } catch (error) {
    console.error('Error en obtenerVentaPorId:', error);
    res.status(500).json({
      success: false,
      message: "Error al buscar venta"
    });
  }
};

/**
 * @desc    Actualizar venta
 * @route   PUT /api/ventas/:id
 * @access  Privado
 */
const actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada"
      });
    }

    await venta.update(req.body);
    
    res.json({
      success: true,
      data: venta,
      message: "Venta actualizada correctamente"
    });

  } catch (error) {
    console.error('Error en actualizarVenta:', error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar venta"
    });
  }
};

/**
 * @desc    Cambiar estado de venta
 * @route   PATCH /api/ventas/:id/estado
 * @access  Privado
 */
const cambiarEstadoVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada"
      });
    }

    await venta.update({ estdo: req.body.estado });
    
    res.json({
      success: true,
      data: { 
        id: venta.idventas,
        nuevoEstado: venta.estdo 
      },
      message: "Estado actualizado correctamente"
    });

  } catch (error) {
    console.error('Error en cambiarEstadoVenta:', error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado"
    });
  }
};

const getMisVentas = async (req, res) => {
  try {
    const idusuario = req.params.idusuario;

    if (!idusuario) {
      return res.status(400).json({ mensaje: 'Falta el idusuario' });
    }

    const cliente = await Cliente.findOne({
      where: { usuario_idusuario: idusuario }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const ventas = await Venta.findAll({
      where: { documentocliente: cliente.documentocliente },
      include: [
        {
          model: VentaProducto,
          as: 'productos',
          include: {
            model: Producto,
            as: 'producto'
          }
        }
      ]
    });

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas del cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
module.exports = {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
  actualizarVenta,
  cambiarEstadoVenta,
  getMisVentas

};