import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Dados padrão para garantir que o sistema funcione mesmo sem backend
const dadosPadrao = {
  nome: 'Sistema de Loja',
  tipoNegocio: 'acaiteria',
  categorias: ['açaí', 'frutas', 'acompanhamentos', 'bebidas', 'sorvetes', 'lanches', 'churros', 'recheios', 'outros'],
  unidades: ['litro', 'kg', 'caixa', 'pacote', 'unidade', 'balde'],
  camposPersonalizados: {},
  configEstoqueBaixo: { global: 5 }
};

const ConfiguracaoContext = createContext();

export const ConfiguracaoProvider = ({ children }) => {
  const [configuracao, setConfiguracao] = useState(dadosPadrao);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarConfiguracao = async () => {
      try {
        // Tentar carregar do backend
        const response = await axios.get('http://localhost:3001/api/configuracao');
        setConfiguracao(response.data || dadosPadrao);
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
        setErro('Não foi possível carregar as configurações do sistema');
        // Usar configuração padrão em caso de erro
        setConfiguracao(dadosPadrao);
      } finally {
        setCarregando(false);
      }
    };

    carregarConfiguracao();
  }, []);

  return (
    <ConfiguracaoContext.Provider value={{
      configuracao,
      setConfiguracao,
      carregando,
      erro
    }}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};

export const useConfiguracao = () => useContext(ConfiguracaoContext);