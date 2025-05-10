const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { secret, expiresIn } = require('../config/jwt');

exports.login = async (req, res) => {
  console.log('🔐 Iniciando login...');
  console.log('📥 Dados recebidos:', req.body);

  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      console.warn('⚠️ E-mail ou senha não enviados no body');
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      console.warn(`❌ Usuário com email '${email}' não encontrado.`);
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    console.log('👤 Usuário encontrado:', {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      console.warn('🔒 Senha inválida para o usuário:', email);
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome },
      secret,
      { expiresIn }
    );

    console.log('✅ Login bem-sucedido!');
    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (err) {
    console.error('🔥 Erro inesperado no login:', err);
    return res.status(500).json({ message: 'Erro no login.', erro: err.message });
  }
};

exports.registrar = async (req, res) => {
  console.log('📝 Iniciando cadastro de novo usuário...');
  console.log('📥 Dados recebidos:', req.body);

  const { nome, email, senha, tipo } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: hash,
      tipo,
    });

    console.log('✅ Usuário registrado com sucesso:', {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });
  } catch (err) {
    console.error('🔥 Erro ao registrar usuário:', err);
    return res.status(500).json({ message: 'Erro ao registrar usuário.', erro: err.message });
  }
};
