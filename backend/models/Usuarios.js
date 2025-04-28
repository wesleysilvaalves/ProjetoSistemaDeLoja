const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('estoquista', 'caixa', 'admin'),
    allowNull: false,
    defaultValue: 'estoquista' // Definindo valor padrão
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
