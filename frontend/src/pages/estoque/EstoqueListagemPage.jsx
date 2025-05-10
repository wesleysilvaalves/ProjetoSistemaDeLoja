import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search, X, AlertTriangle, Grid, ChevronDown, List, Download, Plus, Layers } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useConfiguracao } from '../../contexts/ConfiguracaoContext';

const EstoqueListagemPage = () => {
    const navigate = useNavigate();
    const { configuracao, carregando: carregandoConfig } = useConfiguracao();
    const [produtos, setProdutos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '', tipo: '' });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });
    const [dataAtual, setDataAtual] = useState(new Date());
    const [modoVisualizacao, setModoVisualizacao] = useState('tabela'); // 'tabela', 'cards', 'agrupado'
    const [pesquisaAvancada, setPesquisaAvancada] = useState(false);
    const [filtroPrecoMin, setFiltroPrecoMin] = useState('');
    const [filtroPrecoMax, setFiltroPrecoMax] = useState('');
    const [filtroQuantidadeMin, setFiltroQuantidadeMin] = useState('');
    const [mostrarZerados, setMostrarZerados] = useState(false);
    const [produtosComEstoqueBaixo, setProdutosComEstoqueBaixo] = useState([]);

    useEffect(() => {
        carregarProdutos();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setDataAtual(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (configuracao) {
            setProdutosComEstoqueBaixo(calcularProdutosComEstoqueBaixo());
        }
    }, [produtos, configuracao]);

    const carregarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await axios.get('http://localhost:3001/api/estoque/produtos');
            setProdutos(response.data);
            setErro(null);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    const excluirProduto = (id) => {
        setProdutoParaExcluir(id);
        setModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/estoque/produtos/${produtoParaExcluir}`);
            setNotificacao({ visivel: true, mensagem: 'Produto excluído com sucesso', tipo: 'sucesso' });
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            setNotificacao({ visivel: true, mensagem: 'Erro ao excluir produto', tipo: 'erro' });
        } finally {
            setModalExcluir(false);
            setProdutoParaExcluir(null);
        }
    };

    const cancelarExclusao = () => {
        setModalExcluir(false);
        setProdutoParaExcluir(null);
    };

    // Adicione esta função para padronizar os nomes dos produtos
    const padronizarNomeProduto = (produto) => {
        // Se o produto tem uma palavra simples como "açaí", adicione mais detalhes
        if (produto.nome.toLowerCase() === 'açaí') {
            return `${produto.nome} ${produto.unidade === 'caixa' ? `(${produto.quantidade} ${produto.unidade})` : ''}`;
        }
        return produto.nome;
    };

    // Modificar a função que formata os produtos para exibição
    const produtosFormatados = produtos.map(produto => ({
        ...produto,
        nomeExibicao: padronizarNomeProduto(produto),
        // Crie um ID único que inclui nome+unidade+quantidade para identificar variantes
        varianteId: `${produto.nome.toLowerCase()}-${produto.unidade}-${produto.pesoUnidade || ''}`
    }));

    // Função para unir produtos repetidos
    const unirProdutosRepetidos = (produtos) => {
        const mapa = new Map();
        produtos.forEach(produto => {
            // Chave única: nome-unidade-pesoUnidade (null tratado como '')
            const chave = `${produto.nome.toLowerCase()}-${produto.unidade}-${produto.pesoUnidade || ''}`;
            if (mapa.has(chave)) {
                const existente = mapa.get(chave);
                existente.quantidade += Number(produto.quantidade);
                existente.precoTotal = (Number(existente.precoTotal) || 0) + (Number(produto.precoTotal) || 0);
            } else {
                mapa.set(chave, { ...produto });
            }
        });
        return Array.from(mapa.values());
    };

    // Substitua produtosFormatados por produtosUnificados na filtragem e ordenação
    const produtosUnificados = unirProdutosRepetidos(produtosFormatados);

    const produtosFiltrados = produtosUnificados.filter(produto => {
        const mostrarSeZero = mostrarZerados || produto.quantidade > 0;
        const matchNome = produto.nomeExibicao.toLowerCase().includes(filtro.toLowerCase());
        const matchCategoria = categoriaFiltro === '' || produto.categoria === categoriaFiltro;
        const matchPrecoMin = filtroPrecoMin === '' || (produto.precoTotal && produto.precoTotal >= parseFloat(filtroPrecoMin));
        const matchPrecoMax = filtroPrecoMax === '' || (produto.precoTotal && produto.precoTotal <= parseFloat(filtroPrecoMax));
        const matchQuantidadeMin = filtroQuantidadeMin === '' || produto.quantidade >= parseInt(filtroQuantidadeMin, 10);
        return mostrarSeZero && matchNome && matchCategoria && matchPrecoMin && matchPrecoMax && matchQuantidadeMin;
    });

    const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
        const valorA = a[ordenacao.campo];
        const valorB = b[ordenacao.campo];
        if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
        return 0;
    });

    const produtosPaginados = produtosOrdenados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    // Adicione esta constante para produtos esgotados
    const produtosEsgotados = produtos.filter(produto => produto.quantidade === 0);

    const calcularProdutosComEstoqueBaixo = () => {
        if (!configuracao) return [];

        return produtos.filter(produto => {
            // Verificar se existe configuração específica para a categoria do produto
            const limiteCategoria = configuracao.configEstoqueBaixo.categorias?.[produto.categoria];

            // Usar limite específico da categoria ou o limite global
            const limiteMinimo = limiteCategoria !== undefined
                ? limiteCategoria
                : configuracao.configEstoqueBaixo.global || 5;

            return produto.quantidade < limiteMinimo;
        });
    };

    const exportarCSV = () => {
        const cabecalho = ['Nome', 'Quantidade', 'Unidade', 'Peso/Unidade', 'Preço Total', 'Categoria'];
        const linhas = produtos.map(produto => [
            produto.nome,
            produto.quantidade,
            produto.unidade,
            produto.pesoUnidade || '',
            produto.precoTotal ? `R$ ${Number(produto.precoTotal).toFixed(2)}` : '',
            produto.categoria
        ]);
        const conteudoCSV = [
            cabecalho.join(','),
            ...linhas.map(linha => linha.map(celula => `"${celula}"`).join(','))
        ].join('\n');
        const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `estoque_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const adicionarProduto = () => {
        navigate('/estoque/cadastrar');
    };

    return (
        <>
            {/* Notificações e modais */}
            {notificacao.visivel && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${notificacao.tipo === 'erro' ? 'bg-red-500' : 'bg-green-500'
                    } text-white`}>
                    {notificacao.mensagem}
                    <button
                        onClick={() => setNotificacao({ visivel: false, mensagem: '', tipo: '' })}
                        className="hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {modalExcluir && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90%] text-gray-800 dark:text-white">
                        <div className="flex justify-center mb-4 text-yellow-500">
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Confirmar Exclusão</h3>
                        <p className="text-center mb-6">
                            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={cancelarExclusao}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarExclusao}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo principal */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Listagem de Estoque</h1>
                <img src={logo} alt="Logo" className="w-16 h-16" />
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Última atualização: {dataAtual.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dataAtual.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                </div>
                <div className="md:w-1/3">
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-purple-800"
                    >
                        <option value="">Todas as categorias</option>
                        {configuracao?.categorias.map((categoria) => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtros avançados */}
            <div className="mb-4">
                <button
                    onClick={() => setPesquisaAvancada(!pesquisaAvancada)}
                    className="text-sm text-purple-700 hover:text-purple-900 flex items-center"
                >
                    {pesquisaAvancada ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
                    <ChevronDown size={16} className={`ml-1 transform ${pesquisaAvancada ? 'rotate-180' : ''}`} />
                </button>
                {pesquisaAvancada && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            placeholder="Preço mínimo"
                            value={filtroPrecoMin}
                            onChange={(e) => setFiltroPrecoMin(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                        <input
                            type="number"
                            placeholder="Preço máximo"
                            value={filtroPrecoMax}
                            onChange={(e) => setFiltroPrecoMax(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                        <input
                            type="number"
                            placeholder="Quantidade mínima"
                            value={filtroQuantidadeMin}
                            onChange={(e) => setFiltroQuantidadeMin(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                    </div>
                )}
            </div>

            {/* Filtro para mostrar produtos zerados */}
            <div className="flex items-center mb-4">
                <input
                    id="mostrarZerados"
                    type="checkbox"
                    checked={mostrarZerados}
                    onChange={() => setMostrarZerados(!mostrarZerados)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="mostrarZerados" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Mostrar produtos esgotados (quantidade zero)
                </label>
            </div>

            {/* Estado de carregando */}
            {carregando && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            )}

            {/* Mensagem de erro */}
            {erro && !carregando && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                    <span className="block sm:inline">{erro}</span>
                </div>
            )}

            {/* Aviso de estoque baixo */}
            {produtosComEstoqueBaixo.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex items-center">
                        <AlertTriangle className="text-red-600 mr-2" size={20} />
                        <p className="text-red-700 font-medium">
                            Atenção: {produtosComEstoqueBaixo.length} produto(s) com estoque baixo
                        </p>
                    </div>
                    <div className="mt-2 pl-6">
                        <ul className="list-disc text-sm text-red-700">
                            {produtosComEstoqueBaixo.slice(0, 3).map(produto => (
                                <li key={produto.id}>{produto.nomeExibicao} - Quantidade: {produto.quantidade}</li>
                            ))}
                            {produtosComEstoqueBaixo.length > 3 && (
                                <li className="list-none italic">...e {produtosComEstoqueBaixo.length - 3} mais</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* Produtos esgotados */}
            {produtosEsgotados.length > 0 && (
                <div className="bg-gray-100 border-l-4 border-gray-500 p-4 mb-4">
                    <div className="flex items-center">
                        <AlertTriangle className="text-gray-600 mr-2" size={20} />
                        <p className="text-gray-700 font-medium">
                            Produtos esgotados: {produtosEsgotados.length} item(ns) sem estoque
                        </p>
                    </div>
                    <div className="mt-2 pl-6">
                        <ul className="list-disc text-sm text-gray-700">
                            {produtosEsgotados.slice(0, 3).map(produto => (
                                <li key={produto.id}>{produto.nomeExibicao} - Categoria: {produto.categoria}</li>
                            ))}
                            {produtosEsgotados.length > 3 && (
                                <li className="list-none italic">...e {produtosEsgotados.length - 3} mais</li>
                            )}
                        </ul>
                    </div>
                    <div className="mt-2">
                        <button
                            onClick={() => setMostrarZerados(true)}
                            className="text-sm text-purple-600 hover:text-purple-800"
                        >
                            Mostrar todos os produtos esgotados
                        </button>
                    </div>
                </div>
            )}

            {/* Switch de visualização */}
            <div className="mb-4 flex justify-end">
                <div className="bg-gray-200 rounded-lg p-1 inline-flex">
                    <button
                        onClick={() => setModoVisualizacao('tabela')}
                        className={`px-3 py-1 rounded-md text-sm ${modoVisualizacao === 'tabela'
                            ? 'bg-purple-600 text-white'
                            : 'bg-transparent text-gray-700'
                            }`}
                    >
                        <List size={16} className="inline mr-1" /> Tabela
                    </button>
                    <button
                        onClick={() => setModoVisualizacao('cards')}
                        className={`px-3 py-1 rounded-md text-sm ${modoVisualizacao === 'cards'
                            ? 'bg-purple-600 text-white'
                            : 'bg-transparent text-gray-700'
                            }`}
                    >
                        <Grid size={16} className="inline mr-1" /> Cards
                    </button>
                    <button
                        onClick={() => setModoVisualizacao('agrupado')}
                        className={`px-3 py-1 rounded-md text-sm ${modoVisualizacao === 'agrupado'
                            ? 'bg-purple-600 text-white'
                            : 'bg-transparent text-gray-700'
                            }`}
                    >
                        <Layers size={16} className="inline mr-1" /> Agrupado
                    </button>
                </div>
            </div>

            {/* Exibição dos produtos */}
            {!carregando && !erro && (
                <>
                    {produtosPaginados.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>
                    ) : modoVisualizacao === 'tabela' ? (
                        // Visualização em tabela
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-purple-600 text-white">
                                        <th className="py-2 px-4 text-left">Nome</th>
                                        <th className="py-2 px-4 text-left">Quantidade</th>
                                        <th className="py-2 px-4 text-left">Unidade</th>
                                        <th className="py-2 px-4 text-left">Peso/Unidade</th>
                                        <th className="py-2 px-4 text-left">Preço Total</th>
                                        <th className="py-2 px-4 text-left">Categoria</th>
                                        <th className="py-2 px-4 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosPaginados.map(produto => (
                                        <tr
                                            key={produto.varianteId}
                                            className={`border-b ${produto.quantidade === 0 ? 'bg-gray-100 text-gray-500' : ''}`}
                                        >
                                            <td className="py-2 px-4">{produto.nomeExibicao}</td>
                                            <td className="py-2 px-4">{produto.quantidade}</td>
                                            <td className="py-2 px-4">{produto.unidade}</td>
                                            <td className="py-2 px-4">{produto.pesoUnidade}</td>
                                            <td className="py-2 px-4">
                                                {produto.precoTotal ? `R$ ${Number(produto.precoTotal).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="py-2 px-4">
                                                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                                    {produto.categoria}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/estoque/editar/${produto.id}`)}
                                                        className="p-1 text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
                                                        title="Editar produto"
                                                        aria-label="Editar produto"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => excluirProduto(produto.id)}
                                                        className="p-1 text-red-600 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
                                                        title="Excluir produto"
                                                        aria-label="Excluir produto"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : modoVisualizacao === 'cards' ? (
                        // Visualização em cards
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {produtosPaginados.map(produto => (
                                <div
                                    key={produto.varianteId}
                                    className={`${produto.quantidade === 0
                                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                        } rounded-lg shadow-md border overflow-hidden`}
                                >
                                    {produto.quantidade === 0 && (
                                        <div className="absolute top-0 right-0 bg-gray-500 text-white py-1 px-2 text-xs rounded-bl-lg">
                                            Esgotado
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{produto.nomeExibicao}</h3>
                                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                                                {produto.categoria}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                            <p className="flex justify-between">
                                                <span>Quantidade:</span>
                                                <span className="font-medium">{produto.quantidade} {produto.unidade}</span>
                                            </p>
                                            {produto.pesoUnidade && (
                                                <p className="flex justify-between">
                                                    <span>Peso por unidade:</span>
                                                    <span className="font-medium">{produto.pesoUnidade}</span>
                                                </p>
                                            )}
                                            {produto.precoTotal && (
                                                <p className="flex justify-between">
                                                    <span>Preço total:</span>
                                                    <span className="font-medium">R$ {Number(produto.precoTotal).toFixed(2)}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/estoque/editar/${produto.id}`)}
                                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
                                            title="Editar produto"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => excluirProduto(produto.id)}
                                            className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
                                            title="Excluir produto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Visualização agrupada
                        <div className="space-y-4">
                            {Object.entries(produtosAgrupados).map(([nomeProdutoBase, variantes]) => (
                                <div key={nomeProdutoBase} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 flex justify-between items-center">
                                        <h3 className="font-medium text-purple-800 dark:text-purple-300">
                                            {nomeProdutoBase.charAt(0).toUpperCase() + nomeProdutoBase.slice(1)}
                                        </h3>
                                        <div className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full">
                                            {variantes.length} {variantes.length === 1 ? 'variante' : 'variantes'}
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {variantes.map(produto => (
                                            <div key={produto.id} className="p-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">{produto.quantidade} {produto.unidade} {produto.pesoUnidade ? `(${produto.pesoUnidade})` : ''}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Categoria: {produto.categoria}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                        {produto.precoTotal ? `R$ ${Number(produto.precoTotal).toFixed(2)}` : '-'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/estoque/editar/${produto.id}`)}
                                                        className="p-1 text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
                                                        title="Editar produto"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => excluirProduto(produto.id)}
                                                        className="p-1 text-red-600 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
                                                        title="Excluir produto"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botões de paginação */}
                    <div className="mt-4 flex justify-center gap-2">
                        {Array.from({ length: Math.ceil(produtosFiltrados.length / itensPorPagina) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPaginaAtual(index + 1)}
                                className={`px-3 py-1 rounded ${paginaAtual === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Botões de ações */}
            <div className="mt-6 mb-6 flex justify-between">
                <button
                    onClick={exportarCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
                >
                    <Download size={16} />
                    Exportar CSV
                </button>

                <button
                    onClick={adicionarProduto}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
                >
                    <Plus size={16} />
                    Adicionar Produto
                </button>
            </div>

            {/* Resumo do estoque */}
            <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Resumo do Estoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-md shadow-sm border border-purple-100">
                        <p className="text-sm text-gray-500">Total de Produtos</p>
                        <p className="text-2xl font-bold text-purple-800">{produtos.length}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm border border-purple-100">
                        <p className="text-sm text-gray-500">Valor Total em Estoque</p>
                        <p className="text-2xl font-bold text-purple-800">
                            R$ {produtos
                                .reduce((total, produto) => total + (Number(produto.precoTotal) || 0), 0)
                                .toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm border border-purple-100">
                        <p className="text-sm text-gray-500">Categorias Diferentes</p>
                        <p className="text-2xl font-bold text-purple-800">
                            {new Set(produtos.map(p => p.categoria)).size}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EstoqueListagemPage;