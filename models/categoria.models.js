const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  idcategoria: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1]] // 0=Inactivo, 1=Activo
    }
  },
  imagen: {
    type: DataTypes.STRING(255), // URL larga para Cloudinary
    allowNull: true
  }
}, {
  tableName: 'categoria',
  timestamps: false
});

Categoria.associate = (models) => {
  Categoria.hasMany(models.Producto, {
    foreignKey: 'idcategoria',
    as: 'productos'
  });
};

module.exports = Categoria;
