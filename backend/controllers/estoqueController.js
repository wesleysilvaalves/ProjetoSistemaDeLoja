const ProdutoEstoque = require('../models/ProdutoEstoque');

// Criar produto
const criarProduto = async (req, res) => {
  try {
    const {
      nome,
      quantidade,
      unidade,
      categoria,
      pesoUnidade,
      precoTotal
    } = req.body;

    const novoProduto = await ProdutoEstoque.create({
      nome,
      quantidade,
      unidade,
      categoria,
      pesoUnidade,
      precoTotal
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
};

// Listar todos os produtos
const listarProdutos = async (req, res) => {
  try {
    const produtos = await ProdutoEstoque.findAll();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

// Dar baixa no estoque
const darBaixa = async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  try {
    const produto = await ProdutoEstoque.findByPk(id);

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ erro: 'Quantidade inválida para baixa' });
    }

    if (produto.quantidade < quantidade) {
      return res.status(400).json({ erro: 'Estoque insuficiente' });
    }

    produto.quantidade -= quantidade;
    await produto.save();

    res.json(produto);
  } catch (error) {
    console.error('Erro ao dar baixa no produto:', error);
    res.status(500).json({ erro: 'Erro ao dar baixa no produto' });
  }
};

module.exports = {
  criarProduto,
  listarProdutos,
  darBaixa
};
