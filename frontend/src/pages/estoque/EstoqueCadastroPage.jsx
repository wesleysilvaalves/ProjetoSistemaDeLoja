import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Eye, Clock, CheckCircle } from 'lucide-react';
import logo from '../../assets/logo.png';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useConfiguracao } from '../../contexts/ConfiguracaoContext';

const EstoqueCadastroPage = () => {
    const [produto, setProduto] = useState({
        nome: '',
        quantidade: '',
        unidade: '',
        pesoUnidade: '',
        precoTotal: '',
        precoUnitario: '',
        categoria: '',
        camposPersonalizados: {},
        dataValidade: '',
    });
    const [formErros, setFormErros] = useState({});
    const [mostrarSucesso, setMostrarSucesso] = useState(false);
    const [ultimosProdutos, setUltimosProdutos] = useState([]);
    const [campoEmEdicao, setCampoEmEdicao] = useState(null); // 'unitario' ou 'total'
    const [precoUnitario, setPrecoUnitario] = useState('');
    const timeoutRef = useRef(null);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { configuracao, carregando: carregandoConfig } = useConfiguracao();

    const [sugestoesProdutos, setSugestoesProdutos] = useState([]);
    const [nomeProdutoSelecionado, setNomeProdutoSelecionado] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    const handleChange = (e) => {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    };

    const verificarProdutoDuplicado = async (nome) => {
        if (!nome || nome.length < 3) return;

        try {
            const response = await axios.get(`http://localhost:3001/api/estoque/produtos/verificar?nome=${encodeURIComponent(nome)}`);

            if (response.data.existente) {
                setFormErros(prev => ({
                    ...prev,
                    nome: `Já existe um produto com nome similar: ${response.data.produto.nome}`
                }));
            }
        } catch (error) {
            console.error('Erro ao verificar produto:', error);
        }
    };

    const buscarSugestoes = async (nomeParcial) => {
        if (nomeParcial.length < 2) {
            setSugestoesProdutos([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/api/estoque/produtos/sugestoes?nome=${nomeParcial}`);
            setSugestoesProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar sugestões', error);
        }
    };

    const handleNomeChange = (e) => {
        const nome = e.target.value;
        setProduto(prev => ({ ...prev, nome }));

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => verificarProdutoDuplicado(nome), 500);

        buscarSugestoes(nome);
    };

    const validarFormulario = () => {
        const erros = {};

        if (!produto.nome.trim()) {
            erros.nome = "Nome do produto é obrigatório";
        }

        if (!produto.quantidade) {
            erros.quantidade = "Quantidade é obrigatória";
        } else if (parseFloat(produto.quantidade) < 0) {
            erros.quantidade = "Quantidade não pode ser negativa";
        }

        if (!produto.unidade) {
            erros.unidade = "Selecione uma unidade";
        }

        if (!produto.categoria) {
            erros.categoria = "Selecione uma categoria";
        }

        if (produto.precoTotal && parseFloat(produto.precoTotal) < 0) {
            erros.precoTotal = "Preço não pode ser negativo";
        }

        setFormErros(erros);
        return Object.keys(erros).length === 0;
    };

    const calcularPrecos = () => {
        if (campoEmEdicao === 'unitario' && produto.precoUnitario && produto.quantidade) {
            const total = parseFloat(produto.precoUnitario) * parseFloat(produto.quantidade);
            setProduto(prev => ({ ...prev, precoTotal: total.toFixed(2) }));
        }
        else if (campoEmEdicao === 'total' && produto.precoTotal && produto.quantidade) {
            const unitario = parseFloat(produto.precoTotal) / parseFloat(produto.quantidade);
            setProduto(prev => ({ ...prev, precoUnitario: unitario.toFixed(2) }));
        }
    };

    const calcularPrecoUnitario = () => {
        if (produto.precoTotal && produto.quantidade && parseFloat(produto.quantidade) > 0) {
            const unitario = parseFloat(produto.precoTotal) / parseFloat(produto.quantidade);
            setPrecoUnitario(unitario.toFixed(2));
        } else {
            setPrecoUnitario('');
        }
    };

    useEffect(() => {
        if (produto.quantidade && parseFloat(produto.quantidade) > 0 && campoEmEdicao) {
            calcularPrecos();
        }
    }, [produto.precoTotal, produto.precoUnitario, produto.quantidade, campoEmEdicao]);

    useEffect(() => {
        calcularPrecoUnitario();
    }, [produto.precoTotal, produto.quantidade]);

    useEffect(() => {
        const carregarUltimosProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/estoque/produtos/recentes?limit=3');
                setUltimosProdutos(response.data);
            } catch (error) {
                console.error('Erro ao carregar produtos recentes:', error);
            }
        };

        carregarUltimosProdutos();
    }, []);

    const formatarData = (dataString) => {
        if (!dataString) return '';

        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrecoUnitarioChange = (e) => {
        setCampoEmEdicao('unitario');
        setProduto({ ...produto, precoUnitario: e.target.value });
    };

    const handlePrecoTotalChange = (e) => {
        setCampoEmEdicao('total');
        setProduto({ ...produto, precoTotal: e.target.value });
    };

    const limparFormulario = () => {
        setProduto({
            nome: '',
            quantidade: '',
            unidade: '',
            pesoUnidade: '',
            precoTotal: '',
            precoUnitario: '',
            categoria: '',
            camposPersonalizados: {},
            dataValidade: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setMensagem(null);

        try {
            const response = await axios.post('http://localhost:3001/api/estoque/produtos', produto);

            if (response.data && (response.data.criado || response.data.atualizado)) {
                setMensagem({
                    texto: response.data.atualizado
                        ? `Produto "${produto.nome}" já existia e foi atualizado com mais ${produto.quantidade} ${produto.unidade}.`
                        : 'Produto cadastrado com sucesso!',
                    tipo: response.data.atualizado ? 'info' : 'sucesso'
                });
                limparFormulario();
            } else {
                setMensagem({
                    texto: 'Erro ao cadastrar produto. Tente novamente.',
                    tipo: 'erro'
                });
            }
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            setMensagem({
                texto: 'Erro ao cadastrar produto. Tente novamente.',
                tipo: 'erro'
            });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            {carregandoConfig ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Cadastrar Produto no Estoque</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preencha os dados do novo produto a ser adicionado</p>
                        </div>
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Entrada Rápida:</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setProduto({ ...produto, nome: 'Açaí Premium', quantidade: '10', unidade: 'kg', categoria: 'açaí' })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full"
                            >
                                Açaí Premium
                            </button>
                            <button
                                type="button"
                                onClick={() => setProduto({ ...produto, nome: 'Leite Condensado', quantidade: '1', unidade: 'caixa', categoria: 'recheios' })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full"
                            >
                                Leite Condensado
                            </button>
                            <button
                                type="button"
                                onClick={() => setProduto({ ...produto, nome: 'Banana', quantidade: '1', unidade: 'kg', categoria: 'frutas' })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full"
                            >
                                Banana
                            </button>
                            <button
                                type="button"
                                onClick={() => setProduto({ ...produto, nome: 'Morango', quantidade: '1', unidade: 'kg', categoria: 'frutas' })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full"
                            >
                                Morango
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative mb-4">
                                    <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">Nome do Produto</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={produto.nome}
                                        onChange={handleNomeChange}
                                        placeholder="Ex: Açaí Premium"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                        required
                                    />

                                    {sugestoesProdutos.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                            <div className="p-2 text-xs text-gray-500">Produtos semelhantes já existentes:</div>
                                            {sugestoesProdutos.map((produto, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                                    onClick={() => {
                                                        setProduto(prev => ({
                                                            ...prev,
                                                            nome: produto.nome,
                                                            unidade: produto.unidade,
                                                            categoria: produto.categoria,
                                                            pesoUnidade: produto.pesoUnidade || prev.pesoUnidade
                                                        }));
                                                        setSugestoesProdutos([]);
                                                    }}
                                                >
                                                    <div>
                                                        <div>{produto.nome}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {produto.quantidade} {produto.unidade}
                                                            {produto.pesoUnidade ? ` (${produto.pesoUnidade})` : ''}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                                                        {produto.categoria}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t p-2">
                                                <button
                                                    className="w-full text-center text-sm text-purple-600 hover:text-purple-800"
                                                    onClick={() => setSugestoesProdutos([])}
                                                >
                                                    Ignorar sugestões
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Quantidade <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="quantidade"
                                            value={produto.quantidade}
                                            onChange={handleChange}
                                            placeholder="Ex: 10"
                                            min="0"
                                            step="0.01"
                                            className={`w-full px-4 py-2 rounded-lg border ${formErros.quantidade ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            required
                                        />
                                        {formErros.quantidade && (
                                            <p className="text-red-500 text-xs mt-1">{formErros.quantidade}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Unidade <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="unidade"
                                            value={produto.unidade}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${formErros.unidade ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            required
                                        >
                                            <option value="">Selecione a unidade</option>
                                            {configuracao?.unidades.map((unidade) => (
                                                <option key={unidade} value={unidade}>{unidade}</option>
                                            ))}
                                        </select>
                                        {formErros.unidade && (
                                            <p className="text-red-500 text-xs mt-1">{formErros.unidade}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Peso por Unidade (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            name="pesoUnidade"
                                            value={produto.pesoUnidade}
                                            onChange={handleChange}
                                            placeholder="Ex: 500g"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                    <h4 className="font-medium text-purple-800 mb-3">Informações de Preço</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Preço por Unidade (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                                                <input
                                                    type="number"
                                                    name="precoUnitario"
                                                    value={produto.precoUnitario || ''}
                                                    onChange={handlePrecoUnitarioChange}
                                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    className={`w-full pl-8 px-4 py-2 rounded-lg border ${formErros.precoUnitario ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                />
                                            </div>
                                            {formErros.precoUnitario && (
                                                <p className="text-red-500 text-xs mt-1">{formErros.precoUnitario}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">Valor por cada unidade</p>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Preço Total (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                                                <input
                                                    type="number"
                                                    name="precoTotal"
                                                    value={produto.precoTotal || ''}
                                                    onChange={handlePrecoTotalChange}
                                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    className={`w-full pl-8 px-4 py-2 rounded-lg border ${formErros.precoTotal ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                />
                                            </div>
                                            {formErros.precoTotal && (
                                                <p className="text-red-500 text-xs mt-1">{formErros.precoTotal}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">Valor de todo o lote</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
                                        <p className="flex items-center">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            {produto.quantidade && parseFloat(produto.quantidade) > 0
                                                ? `Com ${produto.quantidade} ${produto.unidade || 'unidades'}, cada ${produto.unidade || 'unidade'} 
                                                custa R$ ${produto.precoUnitario || '0.00'} (total: R$ ${produto.precoTotal || '0.00'})`
                                                : 'Adicione a quantidade para calcular os valores'}
                                        </p>
                                    </div>

                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-700">Preço por unidade:</span>
                                            <span className="font-bold text-blue-800">
                                                {precoUnitario ? `R$ ${precoUnitario}` : '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        Categoria <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="categoria"
                                        value={produto.categoria}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${formErros.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Selecione a categoria</option>
                                        {configuracao?.categorias.map((categoria) => (
                                            <option key={categoria} value={categoria}>{categoria}</option>
                                        ))}
                                    </select>
                                    {formErros.categoria && (
                                        <p className="text-red-500 text-xs mt-1">{formErros.categoria}</p>
                                    )}
                                </div>

                                {produto.categoria && configuracao.camposPersonalizados[produto.categoria] && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Informações adicionais para {produto.categoria}</h4>
                                        {configuracao.camposPersonalizados[produto.categoria].map((campo, index) => (
                                            <div key={index} className="mb-3">
                                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                                    {campo.nome}
                                                </label>
                                                {campo.tipo === 'select' ? (
                                                    <select
                                                        name={`campoPersonalizado_${campo.nome}`}
                                                        value={produto.camposPersonalizados?.[campo.nome] || ''}
                                                        onChange={(e) => setProduto({
                                                            ...produto,
                                                            camposPersonalizados: {
                                                                ...produto.camposPersonalizados,
                                                                [campo.nome]: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
                                                    >
                                                        <option value="">Selecione</option>
                                                        {campo.opcoes.map((opcao, idx) => (
                                                            <option key={idx} value={opcao}>{opcao}</option>
                                                        ))}
                                                    </select>
                                                ) : campo.tipo === 'numero' ? (
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            name={`campoPersonalizado_${campo.nome}`}
                                                            value={produto.camposPersonalizados?.[campo.nome] || ''}
                                                            onChange={(e) => setProduto({
                                                                ...produto,
                                                                camposPersonalizados: {
                                                                    ...produto.camposPersonalizados,
                                                                    [campo.nome]: e.target.value
                                                                }
                                                            })}
                                                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                                            placeholder={`Ex: 5 ${campo.unidade || ''}`}
                                                        />
                                                        {campo.unidade && (
                                                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                                                                {campo.unidade}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={`campoPersonalizado_${campo.nome}`}
                                                        value={produto.camposPersonalizados?.[campo.nome] || ''}
                                                        onChange={(e) => setProduto({
                                                            ...produto,
                                                            camposPersonalizados: {
                                                                ...produto.camposPersonalizados,
                                                                [campo.nome]: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                                        placeholder={campo.placeholder || ''}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {produto.categoria && ['pães', 'frutas', 'vegetais', 'peixes', 'frutos do mar', 'doces', 'bolos'].includes(produto.categoria) && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Data de validade
                                        </label>
                                        <input
                                            type="date"
                                            name="dataValidade"
                                            value={produto.dataValidade || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                        disabled={enviando}
                                    >
                                        {enviando ? 'Enviando...' : 'Cadastrar Produto'}
                                    </button>
                                    {mensagem && (
                                        <p className={`text-sm mt-2 ${mensagem.tipo === 'sucesso' ? 'text-green-500' : mensagem.tipo === 'info' ? 'text-blue-500' : 'text-red-500'}`}>
                                            {mensagem.texto}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                                    Dicas para Cadastro
                                </h3>
                                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <li>Especifique os números sem símbolos e separadores</li>
                                    <li>Você pode digitar o peso do produto junto com a unidade</li>
                                    <li>Se faltar uma categoria, escolha a opção "outros"</li>
                                    <li>Para editar produtos já cadastrados, use a página de listagem</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                                    <Eye size={16} className="mr-1" /> Pré-visualização
                                </h3>
                                {produto.nome ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                                            {produto.nome}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Quantidade: {produto.quantidade || "0"} {produto.unidade || ""}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Valor total: R$ {produto.precoTotal || "0.00"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        Preencha o formulário para visualizar o produto
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                                    <Clock size={16} className="mr-1" /> Últimos Cadastrados
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    Nenhum produto cadastrado recentemente
                                </p>
                            </div>
                        </div>
                    </div>

                    {mostrarSucesso && (
                        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white flex items-center gap-3">
                            <CheckCircle size={20} />
                            Produto cadastrado com sucesso!
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default EstoqueCadastroPage;
