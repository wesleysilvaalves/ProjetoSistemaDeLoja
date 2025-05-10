import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import logo from '../assets/logo.png';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem('');
        try {
            const response = await api.post('/auth/login', { email, senha });
            if (response.data.usuario && response.data.token) {
                login(response.data.usuario, response.data.token);
                setTimeout(() => {
                    navigate(response.data.usuario.tipo === 'admin' ? '/painel' : '/estoque/listar');
                }, 100);
            } else if (response.data.token) {
                login(response.data, response.data.token);
                setTimeout(() => {
                    navigate(response.data.tipo === 'admin' ? '/painel' : '/estoque/listar');
                }, 100);
            } else {
                setMensagem('Credenciais inválidas.');
            }
        } catch (error) {
            setMensagem('Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Logo da Empresa" className="h-20 mb-4" />
                    <h1 className="text-3xl font-bold text-purple-700">Bem-vindo(a)!</h1>
                    <p className="text-gray-600">Faça login para acessar o sistema</p>
                </div>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        aria-label="Digite seu email"
                        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="relative w-full mb-4">
                        <input
                            type={mostrarSenha ? 'text' : 'password'}
                            placeholder="Senha"
                            aria-label="Digite sua senha"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            tabIndex={-1}
                        >
                            {mostrarSenha ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {mensagem && <p className="text-red-500 text-sm mb-4">{mensagem}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="text-gray-500 text-sm text-center mt-6">
                    © {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
