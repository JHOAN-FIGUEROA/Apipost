const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('producto', {
    idproducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precioventa: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    preciocompra: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    detalleproducto: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    codigobarras: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    categoria_idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'idcategoria'
      }
    }
  }, {
    sequelize,
    tableName: 'producto',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idproducto" },
        ]
      },
      {
        name: "fk_producto_categoria_idx",
        using: "BTREE",
        fields: [
          { name: "categoria_idcategoria" },
        ]
      },
    ]
  });
};
