var DataTypes = require("sequelize").DataTypes;
var _categoria = require("./categoria");
var _cliente = require("./cliente");
var _compraproducto = require("./compraproducto");
var _compras = require("./compras");
var _producto = require("./producto");
var _proveedor = require("./proveedor");
var _ventaproducto = require("./ventaproducto");
var _ventas = require("./ventas");

function initModels(sequelize) {
  var categoria = _categoria(sequelize, DataTypes);
  var cliente = _cliente(sequelize, DataTypes);
  var compraproducto = _compraproducto(sequelize, DataTypes);
  var compras = _compras(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var proveedor = _proveedor(sequelize, DataTypes);
  var ventaproducto = _ventaproducto(sequelize, DataTypes);
  var ventas = _ventas(sequelize, DataTypes);

  producto.belongsTo(categoria, { as: "categoria_idcategoria_categorium", foreignKey: "categoria_idcategoria"});
  categoria.hasMany(producto, { as: "productos", foreignKey: "categoria_idcategoria"});
  compraproducto.belongsTo(compras, { as: "compras_idCompras_compra", foreignKey: "compras_idCompras"});
  compras.hasMany(compraproducto, { as: "compraproductos", foreignKey: "compras_idCompras"});
  proveedor.belongsTo(compras, { as: "compras_idCompras_compra", foreignKey: "compras_idCompras"});
  compras.hasMany(proveedor, { as: "proveedors", foreignKey: "compras_idCompras"});
  compraproducto.belongsTo(producto, { as: "producto_idproducto_producto", foreignKey: "producto_idproducto"});
  producto.hasMany(compraproducto, { as: "compraproductos", foreignKey: "producto_idproducto"});
  ventaproducto.belongsTo(producto, { as: "producto_idproducto_producto", foreignKey: "producto_idproducto"});
  producto.hasMany(ventaproducto, { as: "ventaproductos", foreignKey: "producto_idproducto"});
  cliente.belongsTo(ventas, { as: "ventas_idventas_venta", foreignKey: "ventas_idventas"});
  ventas.hasMany(cliente, { as: "clientes", foreignKey: "ventas_idventas"});
  ventaproducto.belongsTo(ventas, { as: "ventas_idventas_venta", foreignKey: "ventas_idventas"});
  ventas.hasMany(ventaproducto, { as: "ventaproductos", foreignKey: "ventas_idventas"});

  return {
    categoria,
    cliente,
    compraproducto,
    compras,
    producto,
    proveedor,
    ventaproducto,
    ventas,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
