const ConfiguracaoNegocio = require('../models/ConfiguracaoNegocio');

// Templates pré-definidos para diferentes tipos de negócio
const tiposNegocioPredefinidos = {
  acaiteria: {
    nome: 'Açaiteria',
    categorias: ['açaí', 'frutas', 'acompanhamentos', 'bebidas', 'sorvetes', 'lanches', 'churros', 'recheios', 'outros'],
    unidades: ['litro', 'kg', 'caixa', 'pacote', 'unidade', 'balde'],
    camposPersonalizados: {},
    configEstoqueBaixo: { global: 5 }
  },
  pizzaria: {
    nome: 'Pizzaria',
    categorias: ['massa', 'molhos', 'queijos', 'carnes', 'vegetais', 'bebidas', 'sobremesas', 'outros'],
    unidades: ['kg', 'litro', 'unidade', 'pacote', 'caixa', 'saco', 'porção'],
    camposPersonalizados: {},
    configEstoqueBaixo: { 
      global: 5, 
      categorias: { 'massa': 3, 'queijos': 2 }
    }
  },
  restauranteJapones: {
    nome: 'Restaurante Japonês',
    categorias: ['peixes', 'frutos do mar', 'arroz', 'vegetais', 'molhos', 'bebidas', 'sobremesas', 'outros'],
    unidades: ['kg', 'g', 'litro', 'ml', 'unidade', 'maki', 'porção'],
    camposPersonalizados: {
      'peixes': [
        { nome: 'temperatura', tipo: 'select', opcoes: ['ambiente', 'refrigerado', 'congelado'] }
      ]
    },
    configEstoqueBaixo: { 
      global: 5, 
      categorias: { 'peixes': 2 }
    }
  },
  hamburgueria: {
    nome: 'Hamburgueria',
    categorias: ['pães', 'carnes', 'queijos', 'vegetais', 'molhos', 'acompanhamentos', 'bebidas', 'sobremesas'],
    unidades: ['kg', 'g', 'litro', 'ml', 'unidade', 'pacote', 'caixa', 'porção'],
    camposPersonalizados: {},
    configEstoqueBaixo: { global: 10 }
  },
  padaria: {
    nome: 'Padaria',
    categorias: ['pães', 'bolos', 'salgados', 'doces', 'matéria-prima', 'bebidas', 'outros'],
    unidades: ['kg', 'g', 'litro', 'ml', 'unidade', 'pacote', 'caixa', 'saco'],
    camposPersonalizados: {
      'pães': [
        { nome: 'prazoValidade', tipo: 'numero', unidade: 'dias' }
      ]
    },
    configEstoqueBaixo: { 
      global: 8, 
      categorias: { 'matéria-prima': 3 }
    }
  }
};

const getConfiguracao = async (req, res) => {
  try {
    // Buscar a configuração ativa
    const configuracao = await ConfiguracaoNegocio.findOne({ where: { ativo: true } });
    
    // Se não existir, retornar a padrão (açaiteria)
    if (!configuracao) {
      return res.json(tiposNegocioPredefinidos.acaiteria);
    }
    
    res.json(configuracao);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.status(500).json({ erro: 'Erro ao buscar configuração' });
  }
};

const criarConfiguracao = async (req, res) => {
  try {
    const { tipoNegocio, nome, categorias, unidades, camposPersonalizados, configEstoqueBaixo } = req.body;
    
    // Desativar configuração anterior se existir
    await ConfiguracaoNegocio.update({ ativo: false }, { where: { ativo: true } });
    
    // Criar nova configuração
    const novaConfig = await ConfiguracaoNegocio.create({
      nome: nome || tiposNegocioPredefinidos[tipoNegocio]?.nome || tipoNegocio,
      tipoNegocio,
      categorias: categorias || tiposNegocioPredefinidos[tipoNegocio]?.categorias || [],
      unidades: unidades || tiposNegocioPredefinidos[tipoNegocio]?.unidades || [],
      camposPersonalizados: camposPersonalizados || tiposNegocioPredefinidos[tipoNegocio]?.camposPersonalizados || {},
      configEstoqueBaixo: configEstoqueBaixo || tiposNegocioPredefinidos[tipoNegocio]?.configEstoqueBaixo || { global: 5 },
      ativo: true
    });
    
    res.status(201).json(novaConfig);
  } catch (error) {
    console.error('Erro ao criar configuração:', error);
    res.status(500).json({ erro: 'Erro ao criar configuração' });
  }
};

const atualizarConfiguracao = async (req, res) => {
  try {
    const { id, nome, categorias, unidades, camposPersonalizados, configEstoqueBaixo } = req.body;
    
    // Buscar configuração existente
    const configuracao = await ConfiguracaoNegocio.findByPk(id);
    
    if (!configuracao) {
      return res.status(404).json({ erro: 'Configuração não encontrada' });
    }
    
    // Atualizar campos
    await configuracao.update({
      nome: nome || configuracao.nome,
      categorias: categorias || configuracao.categorias,
      unidades: unidades || configuracao.unidades,
      camposPersonalizados: camposPersonalizados || configuracao.camposPersonalizados,
      configEstoqueBaixo: configEstoqueBaixo || configuracao.configEstoqueBaixo
    });
    
    res.json(configuracao);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({ erro: 'Erro ao atualizar configuração' });
  }
};

const getTiposNegocio = (req, res) => {
  try {
    const tipos = Object.keys(tiposNegocioPredefinidos).map(key => ({
      id: key,
      nome: tiposNegocioPredefinidos[key].nome
    }));
    
    res.json(tipos);
  } catch (error) {
    console.error('Erro ao buscar tipos de negócio:', error);
    res.status(500).json({ erro: 'Erro ao buscar tipos de negócio' });
  }
};

module.exports = {
  getConfiguracao,
  criarConfiguracao,
  atualizarConfiguracao,
  getTiposNegocio
};