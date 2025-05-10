const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // em vez de '../config/database'

const ProdutoEstoque = sequelize.define('ProdutoEstoque', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  unidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pesoUnidade: {
    type: DataTypes.STRING
  },
  precoTotal: {
    type: DataTypes.FLOAT
  },
  precoUnitario: {
    type: DataTypes.FLOAT
  },
  categoria: {
    type: DataTypes.STRING
  },
  // Campo para rastrear estoque mínimo por produto
  estoqueMinimo: {
    type: DataTypes.FLOAT
  },
  // Campo para validade (produtos perecíveis)
  dataValidade: {
    type: DataTypes.DATE
  },
  // Campos personalizados específicos por tipo de negócio
  camposPersonalizados: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

module.exports = ProdutoEstoque;
