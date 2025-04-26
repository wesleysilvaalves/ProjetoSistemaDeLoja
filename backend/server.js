const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const sequelize = require('./database');
const Usuarios = require('./models/Usuarios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conectado ao banco de dados!');
    return sequelize.sync({ alter: true }); // Atualiza tabelas
  })
  .then(() => {
    console.log('📦 Tabelas sincronizadas com sucesso!');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com o banco:', err);
  });

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 API do sistema de pedidos, estoque e caixa funcionando!');
});

// Rotas protegidas
app.use('/api/users', userRoutes);
app.use('/api/estoque', estoqueRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
