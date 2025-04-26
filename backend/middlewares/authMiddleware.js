const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const tokenLimpo = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET || 'segredo123');
    req.usuario = decoded; // salva os dados do usuário logado na requisição
    next(); // passa pro próximo
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

module.exports = authMiddleware;
