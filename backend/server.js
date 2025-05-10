const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Carrega variáveis do .env antes de tudo

const estoqueRoutes = require('./routes/estoqueRoutes');
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const configuracaoRoutes = require('./routes/configuracaoRoutes'); // Importar as novas rotas

const sequelize = require('./database'); // ✅ Corrigido aqui!
const Usuarios = require('./models/Usuario');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilita CORS preflight
app.use(express.json());

// Conexão com banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conectado ao banco de dados!');
    return sequelize.sync({ alter: true }); // Atualiza ou cria tabelas conforme modelos
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

// Rotas principais
// app.use('/api/users', userRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/configuracao', configuracaoRoutes); // Adicionar às rotas da API

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
