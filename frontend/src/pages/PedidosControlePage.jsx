import React, { useState } from 'react';
import { theme } from '../theme';
import { useNavigate } from 'react-router-dom';

export default function PedidosControlePage() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([
        { id: 1, cliente: 'João', itens: 'Açaí 500ml + Banana', status: 'Análise', hora: '14:30' },
        { id: 2, cliente: 'Maria', itens: 'Açaí 300ml + Morango, Leite Condensado', status: 'Preparo', hora: '14:15' },
        { id: 3, cliente: 'Pedro', itens: 'Açaí 700ml + Granola, Mel', status: 'Entrega', hora: '14:00' },
        { id: 4, cliente: 'Ana', itens: 'Açaí 500ml + Kiwi', status: 'Análise', hora: '14:45' },
        { id: 5, cliente: 'Carlos', itens: 'Açaí 300ml + Paçoca', status: 'Preparo', hora: '14:25' },
        { id: 6, cliente: 'Amanda', itens: 'Açaí 500ml + Chocolate', status: 'Entrega', hora: '14:10' },
    ]);

    const avancarStatus = (id, statusAtual) => {
        const novoStatus = statusAtual === 'Análise' ? 'Preparo' : 
                          statusAtual === 'Preparo' ? 'Entrega' : 'Finalizado';
        
        setPedidos(pedidos.map(pedido => 
            pedido.id === id ? { ...pedido, status: novoStatus } : pedido
        ));
    };

    // Filtrar pedidos por status
    const pedidosAnalise = pedidos.filter(p => p.status === 'Análise');
    const pedidosPreparo = pedidos.filter(p => p.status === 'Preparo');
    const pedidosEntrega = pedidos.filter(p => p.status === 'Entrega');

    const irParaFazerPedido = () => {
        navigate('/fazer-pedido');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-800">Controle de Pedidos</h1>
                <button 
                    onClick={irParaFazerPedido}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md flex items-center"
                >
                    <span className="font-medium">Fazer Novo Pedido</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Coluna 1: Em Análise */}
                <div className="bg-purple-100 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-purple-800 mb-4">Em Análise</h2>
                    <div className="space-y-3">
                        {pedidosAnalise.map((pedido) => (
                            <div key={pedido.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="mb-2">
                                    <span className="font-semibold">Cliente:</span> {pedido.cliente}
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    {pedido.itens}
                                </div>
                                <button 
                                    onClick={() => avancarStatus(pedido.id, pedido.status)}
                                    className="w-full py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                                >
                                    Iniciar Preparo
                                </button>
                            </div>
                        ))}
                        {pedidosAnalise.length === 0 && (
                            <div className="text-center text-gray-500 italic">Nenhum pedido em análise</div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Em Preparo */}
                <div className="bg-pink-100 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-pink-700 mb-4">Em Preparo</h2>
                    <div className="space-y-3">
                        {pedidosPreparo.map((pedido) => (
                            <div key={pedido.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="mb-2">
                                    <span className="font-semibold">Cliente:</span> {pedido.cliente}
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    {pedido.itens}
                                </div>
                                <button 
                                    onClick={() => avancarStatus(pedido.id, pedido.status)}
                                    className="w-full py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                                >
                                    Pronto para Entrega
                                </button>
                            </div>
                        ))}
                        {pedidosPreparo.length === 0 && (
                            <div className="text-center text-gray-500 italic">Nenhum pedido em preparo</div>
                        )}
                    </div>
                </div>

                {/* Coluna 3: Prontos para Entrega */}
                <div className="bg-green-100 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-green-700 mb-4">Prontos para Entrega</h2>
                    <div className="space-y-3">
                        {pedidosEntrega.map((pedido) => (
                            <div key={pedido.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="mb-2">
                                    <span className="font-semibold">Cliente:</span> {pedido.cliente}
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    {pedido.itens}
                                </div>
                                <button 
                                    onClick={() => avancarStatus(pedido.id, pedido.status)}
                                    className="w-full py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Aguardando Retirada
                                </button>
                            </div>
                        ))}
                        {pedidosEntrega.length === 0 && (
                            <div className="text-center text-gray-500 italic">Nenhum pedido pronto para entrega</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mt-6">
                <button 
                    onClick={() => navigate('/painel')}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                    Voltar ao Painel
                </button>
            </div>
        </div>
    );
}
