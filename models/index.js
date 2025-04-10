const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = require('./cliente.model');
const Usuario = require('./usuarios.models');
const Producto = require('./producto.models')(sequelize, DataTypes);
const Venta = require('./ventas.models')(sequelize, DataTypes);
const VentaProducto = require('./ventaproducto')(sequelize, DataTypes);
const Categoria = require('./categoria.models');

const db = {
  sequelize,
  Sequelize,
  Cliente,
  Usuario,
  Producto,
  Venta,
  VentaProducto,
  Categoria
};

// Asociaciones
Venta.associate(db);
VentaProducto.associate(db);
Categoria.associate(db);

module.exports = db;
