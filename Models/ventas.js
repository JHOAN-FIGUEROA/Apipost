const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ventas', {
    idventas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    documentocliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaventa: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    estdo: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ventaproducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ventas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idventas" },
        ]
      },
    ]
  });
};
