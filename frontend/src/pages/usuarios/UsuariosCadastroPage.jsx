import { useState } from 'react';
import axios from 'axios';

export default function CadastroUsuarioPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        funcao: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome) newErrors.nome = 'O campo Nome é obrigatório.';
        if (!formData.email) {
            newErrors.email = 'O campo Email é obrigatório.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Digite um email válido.';
        }
        if (!formData.senha) newErrors.senha = 'O campo Senha é obrigatório.';
        if (!formData.funcao) newErrors.funcao = 'Selecione uma função para o usuário.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/usuarios/register', {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                role: formData.funcao,
            });
            setSuccessMessage('Usuário cadastrado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', funcao: '' });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
            setErrors({ api: error.response?.data?.erro || 'Erro ao cadastrar usuário.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-green-400">
            <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded shadow-md w-full max-w-md text-white"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuário</h1>
                {errors.api && <p className="text-red-500 text-sm mb-4">{errors.api}</p>}
                {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded bg-white text-gray-800 ${errors.nome ? 'border-red-500' : ''
                            }`}
                        placeholder="Digite o nome"
                    />
                    {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded bg-white text-gray-800 ${errors.email ? 'border-red-500' : ''
                            }`}
                        placeholder="Digite o email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Senha</label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded bg-white text-gray-800 ${errors.senha ? 'border-red-500' : ''
                            }`}
                        placeholder="Digite a senha"
                    />
                    {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Função do Usuário</label>
                    <select
                        name="funcao"
                        value={formData.funcao}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded bg-white text-gray-800 ${errors.funcao ? 'border-red-500' : ''
                            }`}
                    >
                        <option value="">Selecione uma função</option>
                        <option value="estoquista">Estoquista</option>
                        <option value="caixa">Caixa</option>
                        <option value="admin">Administrador</option>
                    </select>
                    {errors.funcao && <p className="text-red-500 text-sm">{errors.funcao}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
}