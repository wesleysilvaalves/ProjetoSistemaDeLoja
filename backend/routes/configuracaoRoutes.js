const express = require('express');
const router = express.Router();
const configuracaoController = require('../controllers/configuracaoController');

router.get('/', configuracaoController.getConfiguracao);
router.post('/', configuracaoController.criarConfiguracao);
router.put('/', configuracaoController.atualizarConfiguracao);
router.get('/tipos', configuracaoController.getTiposNegocio);

module.exports = router;