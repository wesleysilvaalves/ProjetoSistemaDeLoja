const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo',
      [nome, email, hashedSenha, tipo]
    );

    res.status(201).json({ usuario: result.rows[0] });
} catch (err) {
    console.error(err); // Mostra o erro no terminal
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }
    return res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
  
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// Perfil (protegido)
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({
    mensagem: `Bem-vindo, ${req.usuario.nome}!`,
    usuario: req.usuario,
  });
});

module.exports = router;
