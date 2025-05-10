import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Filter, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const EstoqueHistoricoPage = () => {
    const [logs, setLogs] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        tipoAcao: '',
        produtoId: '',
        usuarioId: ''
    });
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();

            // Adiciona apenas filtros não vazios
            Object.entries(filtros).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await axios.get(
                `http://localhost:3001/api/estoque/logs?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setLogs(response.data);
        } catch (error) {
            setErro('Erro ao carregar histórico de ações. Faça login novamente ou tente mais tarde.');
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleFiltroChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleSubmitFiltros = (e) => {
        e.preventDefault();
        carregarHistorico();
    };

    const tiposAcao = {
        'cadastro': 'Cadastro',
        'atualizacao': 'Atualização',
        'exclusao': 'Exclusão',
        'baixa': 'Baixa'
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-purple-800 mb-6 flex items-center justify-between">
                Histórico de Ações no Estoque
                <Link to="/estoque/listar" className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg font-semibold ml-4">Voltar ao Estoque</Link>
            </h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                <form onSubmit={handleSubmitFiltros} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Data Inicial</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={16} className="text-gray-500" />
                            </div>
                            <input
                                type="date"
                                name="dataInicio"
                                value={filtros.dataInicio}
                                onChange={handleFiltroChange}
                                className="pl-10 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Data Final</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={16} className="text-gray-500" />
                            </div>
                            <input
                                type="date"
                                name="dataFim"
                                value={filtros.dataFim}
                                onChange={handleFiltroChange}
                                className="pl-10 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Tipo de Ação</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={16} className="text-gray-500" />
                            </div>
                            <select
                                name="tipoAcao"
                                value={filtros.tipoAcao}
                                onChange={handleFiltroChange}
                                className="pl-10 w-full px-4 py-2 border rounded-lg bg-white"
                            >
                                <option value="">Todas as ações</option>
                                {Object.entries(tiposAcao).map(([valor, label]) => (
                                    <option key={valor} value={valor}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {carregando ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                ) : erro ? (
                    <div className="p-8 text-center text-red-500 font-semibold">{erro}</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum registro encontrado
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log, idx) => (
                                    <tr key={log.id} className={log.tipoAcao === 'baixa' && idx < 5 ? 'bg-green-50 font-bold' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User size={16} className="mr-2 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-900">{log.nomeUsuario}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${log.tipoAcao === 'cadastro' ? 'bg-green-100 text-green-800' :
                                                    log.tipoAcao === 'atualizacao' ? 'bg-blue-100 text-blue-800' :
                                                        log.tipoAcao === 'exclusao' ? 'bg-red-100 text-red-800' :
                                                            'bg-purple-100 text-purple-800'}`}>
                                                {tiposAcao[log.tipoAcao]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Package size={16} className="mr-2 text-gray-500" />
                                                <span className="text-sm text-gray-900">{log.produtoNome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {log.tipoAcao === 'baixa' && (
                                                <span>
                                                    {log.detalhes.quantidadeBaixa} {log.detalhes.unidade || ''}
                                                    (Motivo: {log.detalhes.motivo})
                                                </span>
                                            )}
                                            {log.tipoAcao === 'cadastro' && (
                                                <span>
                                                    {log.detalhes.quantidade} {log.detalhes.unidade || ''}
                                                </span>
                                            )}
                                            {log.tipoAcao === 'atualizacao' && (
                                                <span>
                                                    Valores atualizados
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default EstoqueHistoricoPage;