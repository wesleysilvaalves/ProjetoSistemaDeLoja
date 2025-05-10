const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ConfiguracaoNegocio = sequelize.define('ConfiguracaoNegocio', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoNegocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categorias: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  unidades: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  camposPersonalizados: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  configEstoqueBaixo: {
    type: DataTypes.JSON,
    defaultValue: { global: 5, categorias: {} },
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = ConfiguracaoNegocio;