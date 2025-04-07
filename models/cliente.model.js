const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  documentocliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true
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
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  usuario_idusuario: { // <- ESTE ES EL NUEVO CAMPO
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del usuario relacionado',
    references: {
      model: 'usuarios',
      key: 'idusuario'
    }
  }
}, {
  tableName: 'cliente',
  timestamps: false
});


module.exports = Cliente;
