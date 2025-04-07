module.exports = (sequelize, DataTypes) => {
  const Venta = sequelize.define('Venta', {
    idventas: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    documentocliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cliente',
        key: 'documentocliente'
      }
    },
    fechaventa: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    total: {
      type: DataTypes.REAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    estdo: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'ventas',
    timestamps: false,
    indexes: [{ fields: ['documentocliente'] }]
  });

  Venta.associate = function(models) {
    Venta.belongsTo(models.Cliente, {
      foreignKey: 'documentocliente',
      as: 'cliente'
    });

    Venta.hasMany(models.VentaProducto, {
      foreignKey: 'idventa',
      as: 'productos'
    });
  };

  return Venta;
};