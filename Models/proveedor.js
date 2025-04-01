const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proveedor', {
    nitproveedor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    numerodecontacto: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Estado: {
      type: DataTypes.TINYINT,
      allowNull: true
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
    tableName: 'proveedor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nitproveedor" },
        ]
      },
      {
        name: "fk_proveedor_compras1_idx",
        using: "BTREE",
        fields: [
          { name: "compras_idCompras" },
        ]
      },
    ]
  });
};
