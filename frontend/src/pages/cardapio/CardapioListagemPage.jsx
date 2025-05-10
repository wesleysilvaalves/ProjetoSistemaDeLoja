const itensMock = [
    { id: 1, nome: 'Açaí Tradicional', preco: 12.5 },
    { id: 2, nome: 'Açaí Especial', preco: 15.0 },
    { id: 3, nome: 'Copo 500ml', preco: 10.0 },
];

export default function CardapioListagemPage() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Itens do Cardápio</h2>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nome</th>
                        <th className="border px-4 py-2">Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {itensMock.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">{item.nome}</td>
                            <td className="border px-4 py-2">R$ {item.preco.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 