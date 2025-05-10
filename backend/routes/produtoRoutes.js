const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, produtoController.listar);
router.post('/', authMiddleware, roleMiddleware(['admin', 'gerente']), produtoController.cadastrar);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'gerente']), produtoController.atualizar);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), produtoController.deletar);

module.exports = router; 