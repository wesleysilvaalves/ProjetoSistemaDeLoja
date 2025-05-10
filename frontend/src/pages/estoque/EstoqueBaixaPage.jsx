import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackagePlus, List, ArrowDownCircle, ChevronLeft, Home, Search, MinusCircle, Camera, Barcode, Ban, X, History } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useConfiguracao } from '../../contexts/ConfiguracaoContext';
import api from '../../utils/api';

const EstoqueBaixaPage = () => {
    const location = useLocation();
    const [produtos, setProdutos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(false);
    const [processando, setProcessando] = useState(false);
    const [baixa, setBaixa] = useState({
        produtoId: '',
        quantidade: '',
        motivo: 'venda', // valores padrão
        observacao: ''
    });
    const [historicoVisible, setHistoricoVisible] = useState(false);
    const [historicoBaixas, setHistoricoBaixas] = useState([]);
    const [scannerAtivo, setScannerAtivo] = useState(false);
    const [modoBatch, setModoBatch] = useState(false);
    const [produtosSelecionados, setProdutosSelecionados] = useState({});

    const { configuracao } = useConfiguracao();

    // Motivos personalizados baseados no tipo de negócio
    const getMotivos = () => {
        const motivosBase = [
            { valor: 'venda', label: 'Venda' },
            { valor: 'perda', label: 'Perda/Desperdício' },
            { valor: 'validade', label: 'Vencimento' },
            { valor: 'defeito', label: 'Produto Defeituoso' },
            { valor: 'uso_interno', label: 'Uso Interno' },
            { valor: 'outro', label: 'Outro Motivo' }
        ];

        // Motivos específicos por tipo de negócio
        const motivosEspecificos = {
            acaiteria: [
                { valor: 'degustacao', label: 'Degustação' },
                { valor: 'amostra', label: 'Amostra Grátis' },
            ],
            padaria: [
                { valor: 'sobra_diaria', label: 'Sobra do Dia' },
                { valor: 'doacao', label: 'Doação' },
            ],
            restaurante: [
                { valor: 'preparo', label: 'Consumo no Preparo' },
                { valor: 'cortesia', label: 'Cortesia para Cliente' },
            ],
            hamburgueria: [
                { valor: 'descarte_preparo', label: 'Descarte Durante Preparo' },
                { valor: 'refeicao_funcionario', label: 'Refeição de Funcionário' },
            ],
        };

        // Adiciona motivos específicos baseados no tipo de negócio
        if (configuracao.tipoNegocio && motivosEspecificos[configuracao.tipoNegocio]) {
            return [...motivosBase, ...motivosEspecificos[configuracao.tipoNegocio]];
        }

        return motivosBase;
    };

    const motivos = getMotivos();

    useEffect(() => {
        carregarProdutos();
        carregarHistorico();
    }, []);

    const carregarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/api/estoque/produtos');
            setProdutos(response.data);
            setErro(null);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setErro('Falha ao carregar os produtos. Por favor, tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const carregarHistorico = async () => {
        try {
            const response = await api.get('/api/estoque/baixas/recentes');
            setHistoricoBaixas(response.data);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    const produtosFiltrados = produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(filtro.toLowerCase()) && produto.quantidade > 0;
    });

    // Função para unir produtos repetidos
    const unirProdutosRepetidos = (produtos) => {
        const mapa = new Map();
        produtos.forEach(produto => {
            const chave = `${produto.nome.toLowerCase()}-${produto.unidade}-${produto.pesoUnidade || ''}`;
            if (mapa.has(chave)) {
                const existente = mapa.get(chave);
                existente.quantidade += Number(produto.quantidade);
            } else {
                mapa.set(chave, { ...produto });
            }
        });
        return Array.from(mapa.values());
    };

    const produtosUnificados = unirProdutosRepetidos(produtosFiltrados);

    const handleChange = (e) => {
        setBaixa({ ...baixa, [e.target.name]: e.target.value });
    };

    const getProdutoSelecionado = () => {
        return produtos.find(p => p.id === parseInt(baixa.produtoId)) || {};
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const produtoSelecionado = getProdutoSelecionado();

        if (!baixa.produtoId) {
            alert('Selecione um produto');
            return;
        }

        if (!baixa.quantidade || baixa.quantidade <= 0) {
            alert('Informe uma quantidade válida');
            return;
        }

        if (parseFloat(baixa.quantidade) > parseFloat(produtoSelecionado.quantidade)) {
            alert('Quantidade de baixa não pode ser maior que a quantidade disponível em estoque');
            return;
        }

        try {
            setProcessando(true);
            // Obter token do localStorage
            const token = localStorage.getItem('token');

            await api.put(
                `/api/estoque/produtos/${baixa.produtoId}/baixa`,
                {
                    quantidade: baixa.quantidade,
                    motivo: baixa.motivo,
                    observacao: baixa.observacao
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Exibe feedback de sucesso
            setSucesso(true);
            setTimeout(() => setSucesso(false), 3000);

            // Limpar o formulário
            setBaixa({
                produtoId: '',
                quantidade: '',
                motivo: 'venda',
                observacao: ''
            });

            // Recarregar produtos para atualizar o estoque
            carregarProdutos();
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao registrar baixa no estoque');
            console.error('Erro:', error);
        } finally {
            setProcessando(false);
        }
    };

    const handleBatchSubmit = async () => {
        try {
            setProcessando(true);
            const requests = Object.entries(produtosSelecionados).map(([prodId, dados]) => {
                return api.put(`/api/estoque/produtos/${prodId}/baixa`, {
                    quantidade: dados.quantidade,
                    motivo: dados.motivo,
                });
            });
            await Promise.all(requests);

            // Exibe feedback de sucesso
            setSucesso(true);
            setTimeout(() => setSucesso(false), 3000);

            // Limpar seleção
            setProdutosSelecionados({});

            // Recarregar produtos para atualizar o estoque
            carregarProdutos();
        } catch (error) {
            setErro('Erro ao registrar baixa em lote');
            console.error('Erro:', error);
        } finally {
            setProcessando(false);
        }
    };

    const toggleProdutoLote = (produtoId) => {
        setProdutosSelecionados(prev => {
            const novoEstado = { ...prev };
            if (novoEstado[produtoId]) {
                delete novoEstado[produtoId];
            } else {
                novoEstado[produtoId] = { quantidade: 0, motivo: baixa.motivo };
            }
            return novoEstado;
        });
    };

    const updateQtdLote = (produtoId, qtd) => {
        setProdutosSelecionados(prev => ({
            ...prev,
            [produtoId]: {
                ...prev[produtoId],
                quantidade: qtd
            }
        }));
    };

    const sugerirQuantidade = () => {
        if (!produtoSelecionado) return;

        // Se for uma venda, sugerir diferentes quantidades dependendo do tipo de produto
        if (baixa.motivo === 'venda') {
            if (produtoSelecionado.categoria === 'açaí') {
                return [0.5, 1, 2]; // Sugerir quantidades em kg
            }
            else if (produtoSelecionado.unidade === 'unidade') {
                return [1, 5, 10]; // Sugerir quantidades em unidades
            }
            else if (produtoSelecionado.unidade === 'kg') {
                return [0.1, 0.5, 1]; // Sugerir quantidades em kg
            }
        }

        // Para outros motivos, sugerir porcentagens do estoque
        return [
            (quantidadeDisponivel * 0.25).toFixed(2),
            (quantidadeDisponivel * 0.5).toFixed(2),
            quantidadeDisponivel
        ];
    };

    const produtoSelecionado = getProdutoSelecionado();
    const quantidadeDisponivel = produtoSelecionado.quantidade || 0;
    const unidadeProduto = produtoSelecionado.unidade || '';

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Dar Baixa no Estoque</h1>
                <img src={logo} alt="Logo" className="w-16 h-16" />
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="text-sm text-gray-500">Baixas Hoje</h4>
                    <div className="flex items-end">
                        <span className="text-2xl font-bold mr-1">3</span>
                        <span className="text-sm text-gray-500">produtos</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="text-sm text-gray-500">Baixas no Mês</h4>
                    <div className="flex items-end">
                        <span className="text-2xl font-bold mr-1">27</span>
                        <span className="text-sm text-gray-500">produtos</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-red-500">
                    <h4 className="text-sm text-gray-500">Maior Motivo</h4>
                    <div className="flex items-end">
                        <span className="text-xl font-bold mr-1">Venda (65%)</span>
                    </div>
                </div>
            </div>

            <div className="bg-white text-black p-6 rounded-2xl shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lista de Produtos */}
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-purple-800">Selecione os Produtos</h3>
                            <button
                                onClick={() => {
                                    setModoBatch(!modoBatch);
                                    setProdutosSelecionados({});
                                }}
                                className={`px-3 py-1 text-sm rounded-lg font-medium ${modoBatch ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}
                            >
                                {modoBatch ? 'Cancelar Modo Lote' : 'Baixa em Lote'}
                            </button>
                        </div>

                        <div className="mb-4 relative">
                            <div className="relative">
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
                                <button
                                    type="button"
                                    onClick={() => setScannerAtivo(!scannerAtivo)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    title="Usar scanner de código de barras"
                                >
                                    {scannerAtivo ? <Ban size={18} /> : <Barcode size={18} />}
                                </button>
                            </div>

                            {scannerAtivo && (
                                <div className="mt-2 p-4 bg-gray-800 rounded-lg text-center">
                                    <p className="text-white mb-2">Aponte a câmera para o código de barras</p>
                                    <div className="bg-black p-1 rounded">
                                        <Camera size={24} className="mx-auto text-white" />
                                        {/* Aqui você integraria uma biblioteca real de leitura */}
                                    </div>
                                    <button
                                        onClick={() => setScannerAtivo(false)}
                                        className="mt-2 text-sm text-white hover:text-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>

                        {carregando ? (
                            <div className="flex justify-center my-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                        ) : erro ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                                <span className="block sm:inline">{erro}</span>
                            </div>
                        ) : modoBatch ? (
                            <div className="mt-4">
                                {Object.keys(produtosSelecionados).length === 0 ? (
                                    <p className="text-center py-4 text-gray-500">
                                        Selecione produtos para dar baixa em lote
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(produtosSelecionados).map(([prodId, dados]) => {
                                            const prod = produtos.find(p => p.id.toString() === prodId);
                                            return (
                                                <div key={prodId} className="bg-purple-50 p-3 rounded-lg flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{prod.nome}</p>
                                                        <p className="text-sm text-gray-600">Estoque: {prod.quantidade} {prod.unidade}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            value={dados.quantidade}
                                                            onChange={(e) => updateQtdLote(prodId, e.target.value)}
                                                            className="w-20 px-2 py-1 border rounded-md"
                                                            min="0.01"
                                                            max={prod.quantidade}
                                                            step="0.01"
                                                        />
                                                        <button
                                                            onClick={() => toggleProdutoLote(prodId)}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="mt-4">
                                            <button
                                                onClick={handleBatchSubmit}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                                            >
                                                Confirmar Baixa em Lote ({Object.keys(produtosSelecionados).length} produtos)
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
                                {produtosUnificados.length === 0 ? (
                                    <div className="text-center py-6 bg-gray-50">
                                        <p className="text-gray-600">Nenhum produto encontrado</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {produtosUnificados.map((produto) => (
                                            <li
                                                key={produto.id + '-' + produto.unidade + '-' + (produto.pesoUnidade || '')}
                                                className={`p-4 cursor-pointer hover:bg-purple-50 ${baixa.produtoId === produto.id.toString() ? 'bg-purple-100' : ''}`}
                                                onClick={() => modoBatch ? toggleProdutoLote(produto.id.toString()) : setBaixa({ ...baixa, produtoId: produto.id.toString() })}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="text-purple-800 font-medium">{produto.nome}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {produto.quantidade} {produto.unidade} | {produto.categoria}
                                                        </p>
                                                    </div>
                                                    {produto.precoTotal && (
                                                        <span className="text-sm font-semibold">
                                                            R$ {Number(produto.precoTotal).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Formulário de Baixa */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-800 mb-4">Registrar Baixa</h3>

                        {baixa.produtoId ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="bg-purple-100 p-3 rounded-lg mb-4">
                                    <h4 className="font-medium text-purple-800">{produtoSelecionado.nome}</h4>
                                    <p className="text-sm text-purple-700">
                                        Estoque disponível: <span className="font-semibold">{quantidadeDisponivel} {unidadeProduto}</span>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 text-sm">Quantidade para Baixa</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            name="quantidade"
                                            value={baixa.quantidade}
                                            onChange={handleChange}
                                            placeholder={`Máximo: ${quantidadeDisponivel}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            min="0.01"
                                            max={quantidadeDisponivel}
                                            step="0.01"
                                            required
                                        />
                                        <span className="ml-2 text-gray-500">{unidadeProduto}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {sugerirQuantidade().map((qtd, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setBaixa({ ...baixa, quantidade: qtd })}
                                                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
                                            >
                                                {qtd} {unidadeProduto}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 text-sm">Motivo da Baixa</label>
                                    <select
                                        name="motivo"
                                        value={baixa.motivo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                        required
                                    >
                                        {motivos.map((m) => (
                                            <option key={m.valor} value={m.valor}>
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {baixa.motivo === 'perda' && (
                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Tipo de Perda</label>
                                        <select
                                            name="tipoPerdaId"
                                            value={baixa.tipoPerdaId || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                            required
                                        >
                                            <option value="">Selecione o tipo</option>
                                            <option value="1">Queda/Quebra</option>
                                            <option value="2">Armazenamento Inadequado</option>
                                            <option value="3">Erro de Manipulação</option>
                                        </select>
                                    </div>
                                )}

                                {baixa.motivo === 'validade' && (
                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Data de Vencimento</label>
                                        <input
                                            type="date"
                                            name="dataVencimento"
                                            value={baixa.dataVencimento || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}

                                {baixa.motivo === 'venda' && (
                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Valor da Venda (R$)</label>
                                        <input
                                            type="number"
                                            name="valorVenda"
                                            value={baixa.valorVenda || ''}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 mb-1 text-sm">Observação (opcional)</label>
                                    <textarea
                                        name="observacao"
                                        value={baixa.observacao}
                                        onChange={handleChange}
                                        placeholder="Detalhe o motivo da baixa, se necessário"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                    disabled={processando}
                                >
                                    <MinusCircle size={18} />
                                    {processando ? 'Processando...' : 'Confirmar Baixa'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <ArrowDownCircle size={32} className="mx-auto mb-2 text-purple-300" />
                                <p>Selecione um produto da lista para dar baixa</p>
                            </div>
                        )}

                        {sucesso && (
                            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-bounce-in">
                                Baixa registrada com sucesso!
                            </div>
                        )}
                    </div>
                </div>

                {/* Últimas Baixas Registradas */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Últimas Baixas Registradas</h3>
                    {historicoBaixas.length === 0 ? (
                        <p className="text-gray-500">Nenhum registro de baixa encontrado</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {historicoBaixas.slice(0, 5).map((baixa, idx) => (
                                <li key={idx} className={`py-2 flex justify-between items-center ${idx === 0 ? 'bg-green-50 font-bold border-l-4 border-green-400' : ''}`}>
                                    <div>
                                        <span className="font-medium text-purple-700">{baixa.produtoNome || baixa.detalhes?.produtoNome}</span>
                                        <span className="ml-2 text-gray-600">- {baixa.detalhes?.quantidadeBaixa || baixa.detalhes?.quantidade} {baixa.detalhes?.unidade || ''}</span>
                                        <span className="ml-2 text-gray-400 text-xs">por {baixa.nomeUsuario || 'Desconhecido'}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(baixa.timestamp).toLocaleString('pt-BR')}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default EstoqueBaixaPage;