module.exports = (sequelize, DataTypes) => {
  const VentaProducto = sequelize.define('ventaproducto', {
    idventaproducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idventa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precioventa: {
      type: DataTypes.REAL,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.REAL,
      allowNull: false
    }
  }, {
    tableName: 'ventaproducto',
    timestamps: false
  });

  VentaProducto.associate = (models) => {
    VentaProducto.belongsTo(models.Venta, {
      foreignKey: 'idventa',
      as: 'venta'
    });

    VentaProducto.belongsTo(models.Producto, {
      foreignKey: 'idproducto',
      as: 'producto'
    });
  };

  return VentaProducto;
};
