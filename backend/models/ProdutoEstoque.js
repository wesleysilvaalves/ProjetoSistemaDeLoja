const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProdutoEstoque = sequelize.define('ProdutoEstoque', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pesoUnidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  precoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  }
}, {
  tableName: 'produtos_estoque',
  timestamps: true
});

module.exports = ProdutoEstoque;
