const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const authMiddleware = require('../middlewares/authMiddleware');

// Função de segurança para verificar se os métodos do controlador existem
function safeRoute(handler) {
  return (req, res, next) => {
    if (!handler || typeof handler !== 'function') {
      console.error(`Erro: Método do controlador não implementado`);
      return res.status(500).json({ 
        error: 'Método não implementado no controlador' 
      });
    }
    return handler(req, res, next);
  };
}

// Rotas específicas primeiro
router.get('/produtos/sugestoes', safeRoute(estoqueController.buscarSugestoes));

// Rotas para produtos
router.post('/produtos', authMiddleware, safeRoute(estoqueController.criarProduto));
router.get('/produtos', safeRoute(estoqueController.listarProdutos));
router.get('/produtos/:id', safeRoute(estoqueController.buscarProduto));
router.put('/produtos/:id', authMiddleware, safeRoute(estoqueController.atualizarProduto));
router.delete('/produtos/:id', authMiddleware, safeRoute(estoqueController.deletarProduto));

// Rota para baixa de estoque (corrigida para PUT e com id do produto)
router.put('/produtos/:id/baixa', authMiddleware, safeRoute(estoqueController.darBaixa));

// Rota para atualizar estoque mínimo
router.patch('/produto/:id/estoque-minimo', authMiddleware, safeRoute(estoqueController.atualizarEstoqueMinimo));

// Rotas para movimentações de estoque
router.get('/movimentacoes', authMiddleware, safeRoute(estoqueController.listarMovimentacoes));

// Rota para consulta de logs
router.get('/logs', authMiddleware, safeRoute(estoqueController.consultarLogs));

// Rota para últimas baixas registradas
router.get('/baixas/recentes', authMiddleware, async (req, res) => {
  // Chama o controller de logs, mas filtra só por baixas e limita a 10
  req.query.tipoAcao = 'baixa';
  req.query.limit = 10;
  return require('../controllers/estoqueController').consultarLogs(req, res);
});

module.exports = router;

// E no controller:
const buscarSugestoes = async (req, res) => {
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
};
