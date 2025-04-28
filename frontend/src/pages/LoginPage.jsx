import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo.png';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', { email, senha });
            const { token, nome, role } = response.data;

            localStorage.setItem('token', token); // Salva o token no localStorage
            localStorage.setItem('nome', nome);   // Salva o nome no localStorage
            localStorage.setItem('role', role);   // Salva a role no localStorage

            // Adicionando um log para garantir que o redirecionamento está sendo chamado
            console.log("Login bem-sucedido! Redirecionando para a página...", role);

            // Redirecionamento baseado na role
            if (role === 'admin') {
                navigate('/painel'); // Redireciona para o painel
            } else {
                navigate('/estoque/listar'); // Redireciona para o estoque
            }
        } catch (error) {
            console.error(error);
            setMensagem('Email ou senha inválidos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
            <div className="bg-white p-8 rounded-xl shadow-lg w-80">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="h-16" />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    {mensagem && <p className="text-red-500 text-sm mb-4">{mensagem}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
