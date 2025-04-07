module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', { // 👈 Aquí cambia a 'Producto'
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
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'idcategoria'
      }
    },
    precioventa: {
      type: DataTypes.REAL,
      allowNull: false
    },
    preciocompra: {
      type: DataTypes.REAL,
      allowNull: false
    },
    detalleproducto: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    estado: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    codigobarras: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'producto',
    schema: 'public',
    timestamps: false
  });

  Producto.associate = (models) => {
    Producto.hasMany(models.ventaproducto, {
      foreignKey: 'idproducto',
      as: 'ventas'
    });
  };

  return Producto;
};
