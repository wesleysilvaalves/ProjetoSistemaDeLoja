import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import { 
  BarChart2, TrendingUp, DollarSign, ArrowUp, 
  ArrowDown, Package, ShoppingCart, Calendar, 
  Filter, Home, CreditCard, Car, Coffee, RefreshCw,
  Utensils, Receipt, Truck, ShoppingBag, Percent
} from 'lucide-react';
import axios from 'axios';

export default function RelatoriosFinanceirosPage() {
    // Estados para filtros
    const [periodoInicio, setPeriodoInicio] = useState(() => {
        const data = new Date();
        data.setMonth(data.getMonth() - 6);
        return data.toISOString().split('T')[0];
    });
    const [periodoFim, setPeriodoFim] = useState(() => {
        const data = new Date();
        return data.toISOString().split('T')[0];
    });
    const [conta, setConta] = useState('todas');
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState('todos');

    // Estados para dados da API
    const [carregando, setCarregando] = useState(true);
    const [resumoFinanceiro, setResumoFinanceiro] = useState({
        saldo: 0,
        entradas: 0,
        despesas: 0,
        percentualDespesas: 0
    });
    const [entradasPorCategoria, setEntradasPorCategoria] = useState([]);
    const [despesasPorCategoria, setDespesasPorCategoria] = useState([]);
    const [evolucaoMensal, setEvolucaoMensal] = useState([]);
    const [contas, setContas] = useState([]);
    const [despesasCategorias, setDespesasCategorias] = useState([]);

    // Ícones para categorias de despesa
    const iconesPorCategoria = {
        'Aluguel': <Home size={20} />,
        'Fornecedores': <Truck size={20} />,
        'Funcionários': <Utensils size={20} />,
        'Marketing': <Percent size={20} />,
        'Insumos': <ShoppingBag size={20} />,
        'Taxas': <Receipt size={20} />,
        'Outros': <DollarSign size={20} />
    };

    // Carregar todos os dados
    const carregarDados = async () => {
        setCarregando(true);
        try {
            await Promise.all([
                carregarResumoFinanceiro(),
                carregarEntradasPorCategoria(),
                carregarDespesasPorCategoria(),
                carregarEvolucaoMensal(),
                carregarContas(),
                carregarDespesasPrincipais(),
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            console.error('Erro ao carregar dados financeiros');
            alert('Erro ao carregar dados financeiros. Verifique o console para mais detalhes.');
        } finally {
            setCarregando(false);
        }
    };

    // Carregar resumo financeiro
    const carregarResumoFinanceiro = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/resumo', {
                params: {
                    inicio: periodoInicio,
                    fim: periodoFim,
                    conta: conta !== 'todas' ? conta : undefined,
                    ano,
                    mes: mes !== 'todos' ? mes : undefined
                }
            });
            
            if (response.data) {
                setResumoFinanceiro({
                    saldo: response.data.saldo || 0,
                    entradas: response.data.entradas || 0,
                    despesas: response.data.despesas || 0,
                    percentualDespesas: response.data.despesas > 0 && response.data.entradas > 0 
                        ? ((response.data.despesas / response.data.entradas) * 100).toFixed(2) 
                        : 0
                });
            }
        } catch (error) {
            console.error('Erro ao carregar resumo financeiro:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setResumoFinanceiro({
                saldo: 18500.75,
                entradas: 45300.00,
                despesas: 26800.25,
                percentualDespesas: 59.16,
            });
        }
    };

    // Carregar entradas por categoria
    const carregarEntradasPorCategoria = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/entradas/categorias', {
                params: {
                    inicio: periodoInicio,
                    fim: periodoFim,
                    conta: conta !== 'todas' ? conta : undefined,
                    ano,
                    mes: mes !== 'todos' ? mes : undefined
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                setEntradasPorCategoria(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar entradas por categoria:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setEntradasPorCategoria([
                { categoria: 'Açaí Tradicional', valor: 21500 },
                { categoria: 'Açaí Especial', valor: 15800 },
                { categoria: 'Complementos', valor: 4200 },
                { categoria: 'Bebidas', valor: 3800 },
            ]);
        }
    };

    // Carregar despesas por categoria
    const carregarDespesasPorCategoria = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/despesas/categorias', {
                params: {
                    inicio: periodoInicio,
                    fim: periodoFim,
                    conta: conta !== 'todas' ? conta : undefined,
                    ano,
                    mes: mes !== 'todos' ? mes : undefined
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                // Calcular percentuais
                const total = response.data.reduce((acc, item) => acc + item.valor, 0);
                const dadosComPercentual = response.data.map(item => ({
                    ...item,
                    percentual: total > 0 ? (item.valor / total) * 100 : 0
                }));
                
                setDespesasPorCategoria(dadosComPercentual);
            }
        } catch (error) {
            console.error('Erro ao carregar despesas por categoria:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setDespesasPorCategoria([
                { categoria: 'Fornecedores', valor: 9840, percentual: 36.72 },
                { categoria: 'Funcionários', valor: 7200, percentual: 26.87 },
                { categoria: 'Aluguel', valor: 4500, percentual: 16.79 },
                { categoria: 'Marketing', valor: 2800, percentual: 10.45 },
                { categoria: 'Taxas', valor: 2460, percentual: 9.17 },
            ]);
        }
    };

    // Carregar evolução mensal
    const carregarEvolucaoMensal = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/evolucao-mensal', {
                params: {
                    ano,
                    conta: conta !== 'todas' ? conta : undefined
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                setEvolucaoMensal(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar evolução mensal:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setEvolucaoMensal([
                { mes: 'jul', despesas: 22000, entradas: 35000, saldo: 13000 },
                { mes: 'ago', despesas: 23000, entradas: 38000, saldo: 15000 },
                { mes: 'set', despesas: 24000, entradas: 40000, saldo: 16000 },
                { mes: 'out', despesas: 25000, entradas: 42000, saldo: 17000 },
                { mes: 'nov', despesas: 25500, entradas: 43000, saldo: 17500 },
                { mes: 'dez', despesas: 26800, entradas: 45300, saldo: 18500 },
            ]);
        }
    };

    // Carregar contas
    const carregarContas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/contas');
            
            if (response.data && Array.isArray(response.data)) {
                setContas(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setContas([
                { nome: 'Conta Principal', saldo: 15300, positivo: true },
                { nome: 'Poupança', saldo: 8200, positivo: true },
                { nome: 'Cartão Empresa', saldo: 5000, positivo: false },
            ]);
        }
    };

    // Carregar despesas principais
    const carregarDespesasPrincipais = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/financas/despesas/principais', {
                params: {
                    inicio: periodoInicio,
                    fim: periodoFim,
                    conta: conta !== 'todas' ? conta : undefined,
                    ano,
                    mes: mes !== 'todos' ? mes : undefined
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                // Adicionar ícones às categorias
                const despesasComIcones = response.data.map(item => ({
                    ...item,
                    icone: iconesPorCategoria[item.categoria] || <DollarSign size={20} />
                }));
                
                setDespesasCategorias(despesasComIcones);
            }
        } catch (error) {
            console.error('Erro ao carregar despesas principais:', error);
            // Em caso de erro, mantenha dados fictícios para demonstração
            setDespesasCategorias([
                { categoria: 'Aluguel', valor: 4500, icone: <Home size={20} /> },
                { categoria: 'Fornecedores', valor: 9840, icone: <Truck size={20} /> },
                { categoria: 'Funcionários', valor: 7200, icone: <Utensils size={20} /> },
                { categoria: 'Marketing', valor: 2800, icone: <Percent size={20} /> },
            ]);
        }
    };

    // Efeito para carregar dados quando os filtros mudarem
    useEffect(() => {
        carregarDados();
    }, [periodoInicio, periodoFim, conta, ano, mes]);

    // Formatar valores monetários
    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Simplified format to match the design
    const formatarValorSimples = (valor) => {
        return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    // Encontrar valor máximo para gráfico de barras
    const maxEntrada = entradasPorCategoria.length > 0 
        ? Math.max(...entradasPorCategoria.map(item => item.valor))
        : 0;

    // Limpar todos os filtros
    const limparFiltros = () => {
        const dataAtual = new Date();
        const dataInicio = new Date();
        dataInicio.setMonth(dataInicio.getMonth() - 6);
        
        setPeriodoInicio(dataInicio.toISOString().split('T')[0]);
        setPeriodoFim(dataAtual.toISOString().split('T')[0]);
        setConta('todas');
        setAno(dataAtual.getFullYear().toString());
        setMes('todos');
    };

    // Renderizar anos disponíveis (últimos 5 anos)
    const renderizarOpcoesAnos = () => {
        const anoAtual = new Date().getFullYear();
        const anos = [];
        
        for (let i = 0; i < 5; i++) {
            anos.push(anoAtual - i);
        }
        
        return anos.map(ano => (
            <option key={ano} value={ano}>{ano}</option>
        ));
    };

    // Renderizar meses
    const renderizarOpcoesMeses = () => {
        const meses = [
            { valor: '1', nome: 'Janeiro' },
            { valor: '2', nome: 'Fevereiro' },
            { valor: '3', nome: 'Março' },
            { valor: '4', nome: 'Abril' },
            { valor: '5', nome: 'Maio' },
            { valor: '6', nome: 'Junho' },
            { valor: '7', nome: 'Julho' },
            { valor: '8', nome: 'Agosto' },
            { valor: '9', nome: 'Setembro' },
            { valor: '10', nome: 'Outubro' },
            { valor: '11', nome: 'Novembro' },
            { valor: '12', nome: 'Dezembro' }
        ];
        
        return meses.map(mes => (
            <option key={mes.valor} value={mes.valor}>{mes.nome}</option>
        ));
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6 text-white">Dashboard Financeiro - Açaí Delícia</h1>

            <div className="grid grid-cols-12 gap-4">
                {/* Sidebar with filters */}
                <div className="col-span-12 md:col-span-3 bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                            <Utensils size={36} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Conta</label>
                        <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                            value={conta}
                            onChange={(e) => setConta(e.target.value)}
                        >
                            <option value="todas">Todas</option>
                            {contas.map((c, index) => (
                                <option key={index} value={c.id || c.nome}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-gray-300 mb-2">Contas</h3>
                        <div className="space-y-2">
                            {contas.map((c, index) => (
                                <div key={index} className={`flex justify-between items-center border-l-4 ${c.positivo ? 'border-green-500' : 'border-red-500'} pl-2`}>
                                    <span>{c.nome}</span>
                                    <span className={c.positivo ? 'text-green-400' : 'text-red-400'}>
                                        {c.positivo ? '' : '-'}{formatarValorSimples(Math.abs(c.saldo))}
                                    </span>
                                    <span className={`w-3 h-3 rounded-full ${c.positivo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-400 text-sm mb-2">Período</label>
                        <div className="flex flex-col space-y-2">
                            <input 
                                type="date" 
                                className="bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                                value={periodoInicio}
                                onChange={(e) => setPeriodoInicio(e.target.value)}
                            />
                            <input 
                                type="date" 
                                className="bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                                value={periodoFim}
                                onChange={(e) => setPeriodoFim(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-400 text-sm mb-2">Ano</label>
                        <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                        >
                            {renderizarOpcoesAnos()}
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-400 text-sm mb-2">Mês</label>
                        <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            {renderizarOpcoesMeses()}
                        </select>
                    </div>

                    <button 
                        className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center"
                        onClick={limparFiltros}
                    >
                        <RefreshCw size={16} className="mr-2" /> Limpar filtros
                    </button>
                </div>

                {/* Main content area */}
                <div className="col-span-12 md:col-span-9 grid grid-cols-12 gap-4">
                    {carregando ? (
                        <div className="col-span-12 flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            <span className="ml-3">Carregando dados financeiros...</span>
                        </div>
                    ) : (
                        <>
                            {/* Top cards - Saldo, Entradas, Despesas */}
                            <div className="col-span-12 md:col-span-4">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 relative overflow-hidden">
                                    <div className="z-10 relative">
                                        <div className="text-sm text-white/80 mb-1">Saldo</div>
                                        <div className="text-2xl font-bold">R$ {resumoFinanceiro.saldo.toLocaleString('pt-BR')}</div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-full h-16 opacity-50">
                                        <svg viewBox="0 0 100 25" className="w-full h-full">
                                            <path
                                                fill="none"
                                                stroke="rgba(255,255,255,0.4)"
                                                strokeWidth="2"
                                                d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,12 L60,14 L70,8 L80,10 L90,5 L100,2"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <div className="h-full bg-gray-800 rounded-lg p-4 relative overflow-hidden">
                                    <div className="z-10 relative">
                                        <div className="text-sm text-blue-400 mb-1">Entradas</div>
                                        <div className="text-2xl font-bold text-white">R$ {resumoFinanceiro.entradas.toLocaleString('pt-BR')}</div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-full h-16 opacity-50">
                                        <svg viewBox="0 0 100 25" className="w-full h-full">
                                            <path
                                                fill="none"
                                                stroke="rgba(96,165,250,0.4)"
                                                strokeWidth="2"
                                                d="M0,15 L10,17 L20,13 L30,15 L40,10 L50,12 L60,7 L70,9 L80,5 L90,8 L100,3"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <div className="h-full bg-gray-800 rounded-lg p-4 relative overflow-hidden">
                                    <div className="z-10 relative">
                                        <div className="text-sm text-red-400 mb-1">Despesas</div>
                                        <div className="text-2xl font-bold text-white">
                                            R$ {resumoFinanceiro.despesas.toLocaleString('pt-BR')}
                                            <span className="text-xs ml-2 text-red-400">{resumoFinanceiro.percentualDespesas}%</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-full h-16 opacity-50">
                                        <svg viewBox="0 0 100 25" className="w-full h-full">
                                            <path
                                                fill="none"
                                                stroke="rgba(248,113,113,0.4)"
                                                strokeWidth="2"
                                                d="M0,5 L10,8 L20,3 L30,12 L40,8 L50,15 L60,10 L70,18 L80,12 L90,15 L100,10"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Middle section - Top 5 Categories */}
                            <div className="col-span-12 md:col-span-6 bg-gray-800 rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-4">Receitas por Produto</h2>
                                {entradasPorCategoria.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <p className="text-gray-400">Nenhum dado disponível para o período</p>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-end space-x-6 pt-4">
                                        {entradasPorCategoria.map((item, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1">
                                                <div className="w-full flex-grow flex flex-col justify-end items-center">
                                                    <div className="text-xs mb-1 text-blue-300">R$ {(item.valor / 1000).toFixed(1)}k</div>
                                                    <div 
                                                        className="w-full bg-blue-500 rounded-t-sm"
                                                        style={{ height: `${maxEntrada ? (item.valor / maxEntrada) * 100 : 0}%`, maxHeight: '90%' }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs mt-2 text-gray-400">{item.categoria}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-12 md:col-span-6 bg-gray-800 rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-4">Despesas por Categoria</h2>
                                {despesasPorCategoria.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <p className="text-gray-400">Nenhum dado disponível para o período</p>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-48">
                                        <div className="relative w-40 h-40">
                                            {/* Donut chart */}
                                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1f2937" strokeWidth="10" />
                                                
                                                {despesasPorCategoria.map((item, i) => {
                                                    // Calculate stroke offset for each segment
                                                    let previousPercentage = 0;
                                                    for (let j = 0; j < i; j++) {
                                                        previousPercentage += despesasPorCategoria[j].percentual;
                                                    }
                                                    const strokeDasharray = `${item.percentual} ${100 - item.percentual}`;
                                                    const strokeDashoffset = (-previousPercentage);
                                                    
                                                    const colors = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#10b981'];
                                                    
                                                    return (
                                                        <circle 
                                                            key={i}
                                                            cx="50" 
                                                            cy="50" 
                                                            r="45" 
                                                            fill="transparent"
                                                            stroke={colors[i % colors.length]}
                                                            strokeWidth="10"
                                                            strokeDasharray={strokeDasharray}
                                                            strokeDashoffset={`${strokeDashoffset}`}
                                                            className="transition-all duration-500"
                                                        />
                                                    );
                                                })}
                                                <circle cx="50" cy="50" r="35" fill="#1f2937" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-400">Total</div>
                                                    <div className="text-xl font-bold">100%</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pl-6">
                                            <div className="space-y-2">
                                                {despesasPorCategoria.map((item, i) => {
                                                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
                                                    return (
                                                        <div key={i} className="flex items-center">
                                                            <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]} mr-2`}></div>
                                                            <div className="text-xs text-gray-300">
                                                                <span>{item.categoria}</span>
                                                                <span className="ml-2 text-gray-400">{item.percentual.toFixed(2)}%</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom section - Monthly evolution and category summaries */}
                            <div className="col-span-12 md:col-span-8 bg-gray-800 rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-4">Evolução mensal de receitas e despesas</h2>
                                {evolucaoMensal.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <p className="text-gray-400">Nenhum dado disponível para o período</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-xs mb-2">
                                            <span className="inline-block mr-3"><span className="inline-block w-3 h-3 bg-red-500 mr-1"></span> Despesas</span>
                                            <span className="inline-block mr-3"><span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span> Receitas</span>
                                            <span className="inline-block"><span className="inline-block w-3 h-3 bg-white/60 mr-1"></span> Lucro Mensal</span>
                                        </div>
                                        <div className="h-48 relative">
                                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                                                <span>R$ 50k</span>
                                                <span>R$ 0k</span>
                                            </div>
                                            
                                            <div className="ml-8 h-full flex items-end space-x-4">
                                                {evolucaoMensal.map((item, index) => (
                                                    <div key={index} className="flex-1 flex flex-col items-center">
                                                        {/* Bars for expenses and income */}
                                                        <div className="w-full h-40 flex flex-col justify-end items-center relative">
                                                            {/* Expenses bar */}
                                                            <div 
                                                                className="w-1/3 bg-red-500 absolute bottom-0 left-1/4"
                                                                style={{ height: `${(item.despesas / 50000) * 100}%` }}
                                                            ></div>
                                                            
                                                            {/* Income bar */}
                                                            <div 
                                                                className="w-1/3 bg-blue-500 absolute bottom-0 right-1/4"
                                                                style={{ height: `${(item.entradas / 50000) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        
                                                        {/* Month label */}
                                                        <div className="text-xs mt-2 text-gray-400">{item.mes}</div>
                                                        <div className="text-xs text-gray-500">{ano}</div>
                                                    </div>
                                                ))}
                                                
                                                {/* Line for accumulated balance - Using an SVG */}
                                                <svg className="absolute inset-0 w-full h-40 overflow-visible" preserveAspectRatio="none">
                                                    <polyline
                                                        points="60,130 120,140 180,150 240,145 300,110 360,110"
                                                        fill="none"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                        strokeOpacity="0.6"
                                                    />
                                                    <circle cx="60" cy="130" r="3" fill="white" fillOpacity="0.6" />
                                                    <circle cx="120" cy="140" r="3" fill="white" fillOpacity="0.6" />
                                                    <circle cx="180" cy="150" r="3" fill="white" fillOpacity="0.6" />
                                                    <circle cx="240" cy="145" r="3" fill="white" fillOpacity="0.6" />
                                                    <circle cx="300" cy="110" r="3" fill="white" fillOpacity="0.6" />
                                                    <circle cx="360" cy="110" r="3" fill="white" fillOpacity="0.6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                                {despesasCategorias.length === 0 ? (
                                    <div className="col-span-2 h-48 flex items-center justify-center bg-gray-800 rounded-lg">
                                        <p className="text-gray-400">Nenhum dado disponível para o período</p>
                                    </div>
                                ) : (
                                    despesasCategorias.map((item, index) => (
                                        <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center">
                                            <div className={`w-10 h-10 rounded-full ${index % 2 === 0 ? 'bg-purple-500/20' : 'bg-pink-500/20'} flex items-center justify-center text-${index % 2 === 0 ? 'purple' : 'pink'}-400 mr-3`}>
                                                {item.icone}
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">{item.categoria}</div>
                                                <div className="font-semibold">{formatarValorSimples(item.valor)}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 