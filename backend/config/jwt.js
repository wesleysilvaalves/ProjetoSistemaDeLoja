module.exports = {
  secret: process.env.JWT_SECRET || 'sua_chave_secreta',
  expiresIn: '8h',
}; 