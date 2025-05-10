import { useState } from 'react';

const pedidosMock = [
    { id: 1, cliente: 'João', itens: 'Açaí 500ml + Banana', status: 'analise' },
    { id: 2, cliente: 'Ana', itens: 'Açaí 500ml + Kiwi', status: 'analise' },
    { id: 3, cliente: 'Maria', itens: 'Açaí 300ml + Morango, Leite Condensado', status: 'preparo' },
    { id: 4, cliente: 'Carlos', itens: 'Açaí 300ml + Paçoca', status: 'preparo' },
    { id: 5, cliente: 'Pedro', itens: 'Açaí 700ml + Granola, Mel', status: 'pronto' },
    { id: 6, cliente: 'Amanda', itens: 'Açaí 500ml + Chocolate', status: 'pronto' },
];

const statusLabels = {
    analise: 'Em Análise',
    preparo: 'Em Preparo',
    pronto: 'Prontos para Entrega',
};

const statusColors = {
    analise: 'bg-purple-100',
    preparo: 'bg-red-100',
    pronto: 'bg-green-100',
};

export default function PedidosControlePage() {
    const [pedidos, setPedidos] = useState(pedidosMock);

    const mudarStatus = (id, novoStatus) => {
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Controle de Pedidos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['analise', 'preparo', 'pronto'].map((status) => (
                    <div key={status} className={`rounded-xl shadow-lg p-6 ${statusColors[status]}`}>
                        <h2 className="text-xl font-bold mb-4">{statusLabels[status]}</h2>
                        {pedidos.filter((p) => p.status === status).length === 0 ? (
                            <p className="text-gray-500">Nenhum pedido</p>
                        ) : (
                            pedidos.filter((p) => p.status === status).map((pedido) => (
                                <div key={pedido.id} className="mb-4 bg-white rounded-lg p-4 shadow flex flex-col gap-2">
                                    <div><b>Cliente:</b> {pedido.cliente}</div>
                                    <div className="text-sm text-gray-600">{pedido.itens}</div>
                                    {status === 'analise' && (
                                        <button onClick={() => mudarStatus(pedido.id, 'preparo')} className="mt-2 bg-purple-400 text-white px-4 py-2 rounded">Iniciar Preparo</button>
                                    )}
                                    {status === 'preparo' && (
                                        <button onClick={() => mudarStatus(pedido.id, 'pronto')} className="mt-2 bg-pink-400 text-white px-4 py-2 rounded">Pronto para Entrega</button>
                                    )}
                                    {status === 'pronto' && (
                                        <button disabled className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Aguardando Retirada</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-8">
                <button className="bg-green-400 text-white px-6 py-3 rounded-lg font-bold shadow">Fazer Novo Pedido</button>
            </div>
        </div>
    );
} 