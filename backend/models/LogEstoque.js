const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const LogEstoque = sequelize.define('LogEstoque', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nomeUsuario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipoAcao: {
    type: DataTypes.ENUM('cadastro', 'atualizacao', 'exclusao', 'baixa'),
    allowNull: false
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  produtoNome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  detalhes: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = LogEstoque;