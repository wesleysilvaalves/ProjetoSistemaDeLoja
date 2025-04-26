/*const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas de estoque protegidas por autenticação
router.post('/', authMiddleware, estoqueController.criarProduto);     // Cadastrar produto
router.get('/', authMiddleware, estoqueController.listarProdutos);   // Listar produtos
router.put('/:id/baixa', authMiddleware, estoqueController.darBaixa); // Dar baixa no estoque

module.exports = router;
*/


const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// Rotas de estoque SEM autenticação temporariamente
router.post('/', estoqueController.criarProduto);
router.get('/', estoqueController.listarProdutos);
router.put('/:id/baixa', estoqueController.darBaixa);

module.exports = router;
