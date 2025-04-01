const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compraproducto', {
    idcompraproducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idcompra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preciodecompra: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    codigobarras: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    producto_idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producto',
        key: 'idproducto'
      }
    },
    compras_idCompras: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'compras',
        key: 'idCompras'
      }
    }
  }, {
    sequelize,
    tableName: 'compraproducto',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcompraproducto" },
        ]
      },
      {
        name: "fk_compraproducto_producto1_idx",
        using: "BTREE",
        fields: [
          { name: "producto_idproducto" },
        ]
      },
      {
        name: "fk_compraproducto_compras1_idx",
        using: "BTREE",
        fields: [
          { name: "compras_idCompras" },
        ]
      },
    ]
  });
};
