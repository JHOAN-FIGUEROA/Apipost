const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ventaproducto', {
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
      type: DataTypes.FLOAT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ventas_idventas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'idventas'
      }
    },
    producto_idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producto',
        key: 'idproducto'
      }
    }
  }, {
    sequelize,
    tableName: 'ventaproducto',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idventaproducto" },
        ]
      },
      {
        name: "fk_ventaproducto_ventas1_idx",
        using: "BTREE",
        fields: [
          { name: "ventas_idventas" },
        ]
      },
      {
        name: "fk_ventaproducto_producto1_idx",
        using: "BTREE",
        fields: [
          { name: "producto_idproducto" },
        ]
      },
    ]
  });
};
