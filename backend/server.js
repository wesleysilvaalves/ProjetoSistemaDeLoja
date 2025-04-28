const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./database');
const userRoutes = require('./controllers/userController');

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', userRoutes);

// Teste de conexão com banco
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado ao banco de dados!');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com o banco:', err);
  });

// Rodando servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
