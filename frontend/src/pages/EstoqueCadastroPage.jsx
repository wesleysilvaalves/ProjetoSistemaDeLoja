import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import DashboardLayout from '../layouts/DashboardLayout';

const unidades = ['litro', 'kg', 'caixa', 'pacote', 'unidade', 'balde'];
const categorias = ['açaí', 'frutas', 'acompanhamentos', 'bebidas', 'sorvetes', 'lanches', 'churros', 'recheios', 'outros'];

const EstoqueCadastroPage = () => {
    const [produto, setProduto] = useState({
        nome: '',
        quantidade: '',
        unidade: '',
        pesoUnidade: '',
        precoTotal: '',
        categoria: '',
    });

    const handleChange = (e) => {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(produto.quantidade) < 0) {
            alert('Quantidade não pode ser negativa');
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/estoque', produto);
            alert('Produto cadastrado com sucesso!');
            setProduto({
                nome: '',
                quantidade: '',
                unidade: '',
                pesoUnidade: '',
                precoTotal: '',
                categoria: '',
            });
        } catch (error) {
            alert('Erro ao cadastrar produto');
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-500 to-green-300">
                <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white bg-opacity-90 rounded-xl shadow-xl">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-20" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Cadastrar Produto no Estoque</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <input
                            type="text"
                            name="nome"
                            value={produto.nome}
                            onChange={handleChange}
                            placeholder="Nome do produto"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <input
                            type="number"
                            name="quantidade"
                            value={produto.quantidade}
                            onChange={handleChange}
                            placeholder="Quantidade (ex: 2 baldes)"
                            min="0"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <select
                            name="unidade"
                            value={produto.unidade}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-purple-800"
                            required
                        >
                            <option value="">Selecione a unidade</option>
                            {unidades.map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="pesoUnidade"
                            value={produto.pesoUnidade}
                            onChange={handleChange}
                            placeholder="Peso por unidade (opcional)"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300"
                        />
                        <input
                            type="number"
                            name="precoTotal"
                            value={produto.precoTotal}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Preço total (opcional)"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300"
                        />
                        <select
                            name="categoria"
                            value={produto.categoria}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-purple-800"
                            required
                        >
                            <option value="">Selecione a categoria</option>
                            {categorias.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Cadastrar
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EstoqueCadastroPage;
