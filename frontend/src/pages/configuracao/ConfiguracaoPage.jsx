import React from 'react';
import { useConfiguracao } from '../../contexts/ConfiguracaoContext';
import logo from '../../assets/logo.png';

const ConfiguracaoPage = () => {
    const { configuracao, carregando } = useConfiguracao();

    if (carregando) {
        return (
            <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-800">Configurações do Sistema</h1>
                <img src={logo} alt="Logo" className="w-16 h-16" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <p className="text-gray-500 text-sm">Nome do Negócio</p>
                        <p className="font-medium">{configuracao.nome}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-500 text-sm">Tipo de Negócio</p>
                        <p className="font-medium capitalize">{configuracao.tipoNegocio}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-medium mb-3">Categorias de Produtos</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {configuracao.categorias.map((categoria, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
                        >
                            {categoria}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-medium mb-3">Unidades de Medida</h3>
                <div className="flex flex-wrap gap-2">
                    {configuracao.unidades.map((unidade, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                        >
                            {unidade}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                    As funções de edição de configurações serão implementadas em breve.
                    Por enquanto, esta página é apenas informativa.
                </p>
            </div>
        </div>
    );
};

export default ConfiguracaoPage;