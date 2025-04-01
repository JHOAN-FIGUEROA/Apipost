const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cliente', {
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    numerocontacto: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ventas_idventas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'idventas'
      }
    }
  }, {
    sequelize,
    tableName: 'cliente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idCliente" },
        ]
      },
      {
        name: "fk_cliente_ventas1_idx",
        using: "BTREE",
        fields: [
          { name: "ventas_idventas" },
        ]
      },
    ]
  });
};
