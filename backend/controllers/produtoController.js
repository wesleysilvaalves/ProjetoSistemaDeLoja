const Produto = require('../models/Produto');

exports.listar = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar produtos.' });
  }
};

exports.cadastrar = async (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;
  try {
    const produto = await Produto.create({ nome, descricao, preco, quantidade });
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar produto.' });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade } = req.body;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    await produto.update({ nome, descricao, preco, quantidade });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar produto.' });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    await produto.destroy();
    res.json({ message: 'Produto removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover produto.' });
  }
}; 