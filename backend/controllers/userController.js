const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuarios');
const router = express.Router();

// Rota de cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, role } = req.body;

  try {
    // Verifica se o e-mail já está registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já está registrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      role
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, role: usuario.role },
      'sua-chave-secreta', // Troque pela sua chave secreta
      { expiresIn: '1h' }  // O token vai expirar após 1 hora
    );

    return res.json({
      token,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

module.exports = router;
