const { Op } = require('sequelize');
const ProdutoEstoque = require('../models/ProdutoEstoque');
const LogEstoque = require('../models/LogEstoque');

const estoqueController = {
  criarProduto: async (req, res) => {
    try {
      let { nome, quantidade, unidade, pesoUnidade, precoTotal, categoria } = req.body;
      let usuario = req.usuario;

      // Padronizar pesoUnidade vazio, undefined ou string vazia como null
      if (!pesoUnidade || pesoUnidade === '' || pesoUnidade === undefined) {
        pesoUnidade = null;
      }

      // Verificar se existe produto EXATAMENTE igual (nome, unidade e pesoUnidade)
      const produtoExistente = await ProdutoEstoque.findOne({
        where: {
          [Op.and]: [
            { nome: { [Op.iLike]: nome } },
            { unidade: unidade },
            { pesoUnidade: pesoUnidade }
          ]
        }
      });

      if (produtoExistente) {
        const novaQuantidade = Number(produtoExistente.quantidade) + Number(quantidade);
        let novoPrecoTotal = produtoExistente.precoTotal;

        if (precoTotal) {
          novoPrecoTotal = (Number(produtoExistente.precoTotal) || 0) + Number(precoTotal);
        }

        await produtoExistente.update({
          quantidade: novaQuantidade,
          precoTotal: novoPrecoTotal
        });

        // Só registra log se usuario existir
        if (usuario && usuario.id) {
          await LogEstoque.create({
            usuarioId: usuario.id,
            nomeUsuario: usuario.nome,
            tipoAcao: 'atualizacao',
            produtoId: produtoExistente.id,
            produtoNome: produtoExistente.nome,
            detalhes: {
              quantidade,
              unidade,
              pesoUnidade,
              precoTotal,
              categoria
            }
          });
        }

        return res.status(200).json({
          mensagem: "Produto atualizado com sucesso",
          produto: produtoExistente,
          atualizado: true
        });
      }

      // Registra o produto criado
      const novoProduto = await ProdutoEstoque.create({
        nome,
        quantidade,
        unidade,
        pesoUnidade,
        precoTotal,
        categoria
      });

      // Só registra log se usuario existir
      if (usuario && usuario.id) {
        await LogEstoque.create({
          usuarioId: usuario.id,
          nomeUsuario: usuario.nome,
          tipoAcao: 'cadastro',
          produtoId: novoProduto.id,
          produtoNome: novoProduto.nome,
          detalhes: {
            quantidade,
            unidade,
            pesoUnidade,
            precoTotal,
            categoria
          }
        });
      }

      res.status(201).json({
        mensagem: "Produto criado com sucesso",
        produto: novoProduto,
        criado: true
      });
    } catch (error) {
      console.error("Erro ao processar produto:", error);
      res.status(500).json({ erro: "Erro ao processar a solicitação" });
    }
  },

  listarProdutos: async (req, res) => {
    try {
      const produtos = await ProdutoEstoque.findAll();
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ erro: 'Erro ao listar produtos' });
    }
  },

  buscarProduto: async (req, res) => {
    const { id } = req.params;

    try {
      const produto = await ProdutoEstoque.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json(produto);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
  },

  atualizarProduto: async (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, unidade, categoria, pesoUnidade, precoTotal } = req.body;

    try {
      const produto = await ProdutoEstoque.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      await produto.update({
        nome,
        quantidade,
        unidade,
        categoria,
        pesoUnidade,
        precoTotal
      });

      res.json(produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
  },

  deletarProduto: async (req, res) => {
    const { id } = req.params;

    try {
      const produto = await ProdutoEstoque.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      await produto.destroy();

      res.json({ mensagem: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ erro: 'Erro ao excluir produto' });
    }
  },

  darBaixa: async (req, res) => {
    const { id } = req.params;
    const { quantidade, motivo, observacao } = req.body;
    const usuario = req.usuario;

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

      const quantidadeAnterior = produto.quantidade;
      produto.quantidade -= quantidade;
      await produto.save();

      // Registra a ação no log, mesmo se usuario não existir
      const logData = {
        usuarioId: usuario?.id || null,
        nomeUsuario: usuario?.nome || 'Desconhecido',
        tipoAcao: 'baixa',
        produtoId: produto.id,
        produtoNome: produto.nome,
        detalhes: {
          quantidadeAnterior,
          quantidadeBaixa: quantidade,
          quantidadeAtual: produto.quantidade,
          motivo,
          observacao
        }
      };
      console.log('Registrando log de baixa:', logData);
      await LogEstoque.create(logData);

      res.json(produto);
    } catch (error) {
      console.error('Erro ao dar baixa no produto:', error);
      res.status(500).json({ erro: 'Erro ao dar baixa no produto' });
    }
  },

  atualizarEstoqueMinimo: async (req, res) => {
    // Implementação...
  },

  buscarSugestoes: async (req, res) => {
    try {
      const { nome } = req.query;
      
      if (!nome || nome.length < 2) {
        return res.json([]);
      }
      
      const produtos = await ProdutoEstoque.findAll({
        where: {
          nome: {
            [Op.iLike]: `%${nome}%`
          }
        },
        limit: 5
      });
      
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      res.status(500).json({ erro: 'Erro ao buscar sugestões' });
    }
  },

  listarMovimentacoes: async (req, res) => {
    // Implementação...
  },

  consultarLogs: async (req, res) => {
    try {
      const { produtoId, usuarioId, tipoAcao, dataInicio, dataFim } = req.query;
      
      let where = {};
      
      if (produtoId) where.produtoId = produtoId;
      if (usuarioId) where.usuarioId = usuarioId;
      if (tipoAcao) where.tipoAcao = tipoAcao;
      
      if (dataInicio || dataFim) {
        where.timestamp = {};
        if (dataInicio) where.timestamp[Op.gte] = new Date(dataInicio);
        if (dataFim) where.timestamp[Op.lte] = new Date(dataFim);
      }
      
      const logs = await LogEstoque.findAll({
        where,
        order: [['timestamp', 'DESC']],
        limit: req.query.limit ? parseInt(req.query.limit) : 100
      });
      
      res.json(logs);
    } catch (error) {
      console.error('Erro ao consultar logs:', error);
      res.status(500).json({ erro: 'Erro ao consultar logs' });
    }
  }
};

module.exports = estoqueController;
