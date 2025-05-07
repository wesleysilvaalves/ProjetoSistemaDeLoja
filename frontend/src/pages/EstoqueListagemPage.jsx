import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';

const EstoqueListagemPage = () => {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/estoque');
                setProdutos(response.data);
            } catch (error) {
                alert('Erro ao carregar produtos do estoque');
            }
        };

        buscarProdutos();
    }, []);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex justify-center mb-4">
                <img src={logo} alt="Logo" className="w-20" />
            </div>
            <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">
                Produtos em Estoque
            </h2>

            <div className="w-full bg-white shadow-xl rounded-xl p-4 sm:p-6 overflow-x-auto">
                <table className="w-full text-sm sm:text-base table-auto border border-gray-300 rounded-lg">
                    <thead className="bg-purple-700 text-white">
                        <tr>
                            <th className="p-3 text-left">Nome</th>
                            <th className="p-3 text-center">Quantidade</th>
                            <th className="p-3 text-center">Unidade</th>
                            <th className="p-3 text-center">Peso Unid.</th>
                            <th className="p-3 text-center">Categoria</th>
                            <th className="p-3 text-center">Preço Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-600">
                                    Nenhum produto cadastrado
                                </td>
                            </tr>
                        ) : (
                            produtos.map((produto) => (
                                <tr key={produto.id} className="border-t text-center">
                                    <td className="p-3 text-left">{produto.nome}</td>
                                    <td className="p-3">{produto.quantidade}</td>
                                    <td className="p-3">{produto.unidade}</td>
                                    <td className="p-3">{produto.pesoUnidade || '-'}</td>
                                    <td className="p-3">{produto.categoria}</td>
                                    <td className="p-3">R$ {parseFloat(produto.precoTotal || 0).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EstoqueListagemPage;