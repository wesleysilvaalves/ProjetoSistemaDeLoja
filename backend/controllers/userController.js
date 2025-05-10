const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastrar novo usuário
exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: hash,
      tipo,
    });

    res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhe: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '8h' }
    );

    res.json({ mensagem: 'Login realizado com sucesso', token, usuario });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhe: err.message });
  }
};
