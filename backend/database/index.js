const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'projetowesley',  // substitua pelo nome real do banco
  'postgres',        // substitua pelo seu usuário PostgreSQL
  'ric061026',          // substitua pela sua senha real
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433,
    logging: false,
  }
);

module.exports = sequelize;
