const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('\n📦 CONFIG .env:');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD tipo:', typeof process.env.DB_PASSWORD);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false,
  }
);

// Teste da conexão
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('❌ Não foi possível conectar ao banco de dados:', err);
  });

module.exports = sequelize;
