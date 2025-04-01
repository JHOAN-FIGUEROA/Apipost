const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compras', {
    idCompras: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nrodecompra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechadecompra: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaderegistro: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    nitproveedor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idcompraproducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'compras',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idCompras" },
        ]
      },
    ]
  });
};
