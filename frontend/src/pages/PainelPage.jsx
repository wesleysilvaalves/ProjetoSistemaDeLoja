import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import ThemeAndLogoutButtons from '../components/ThemeAndLogoutButtons';
import { ThemeContext } from '../contexts/ThemeContext';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function PainelPage() {
    const navigate = useNavigate();
    const nome = sessionStorage.getItem('nome') || 'Usuário';
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-green-400 flex flex-col">
            {/* Cabeçalho */}
            <header className="bg-purple-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <img
                        src="/logo-parada-do-acai.png"
                        alt="Logo"
                        className="w-12 h-12"
                    />
                    <h1 className="text-3xl font-bold">
                        Bem-vindo, {nome}!
                    </h1>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 bg-purple-700 dark:bg-gray-700 hover:bg-purple-800 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold shadow-lg transition"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        <span className="whitespace-nowrap">Modo Escuro</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold shadow-lg transition"
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-grow flex flex-col items-center justify-center p-8">
                {/* Logo acima dos cards */}
                <div className="mb-8">
                    <img
                        src="/logo-parada-do-acai.png"
                        alt="Logo Principal"
                        className="w-64 h-64 mx-auto"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {/* Card Estoque */}
                    <div
                        onClick={() => navigate('/estoque')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Gerenciar Estoque"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1549/1549291.png"
                            alt="Gerenciar Estoque"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Gerenciar Estoque</h2>
                    </div>

                    {/* Card Pedidos */}
                    <div
                        onClick={() => navigate('/pedidos')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Visualizar Pedidos"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
                            alt="Visualizar Pedidos"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Visualizar Pedidos</h2>
                    </div>

                    {/* Card Relatórios */}
                    <div
                        onClick={() => navigate('/relatorios')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Relatórios Financeiros"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
                            alt="Relatórios Financeiros"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Relatórios Financeiros</h2>
                    </div>

                    {/* Card Cadastro de Usuários */}
                    <div
                        onClick={() => navigate('/usuarios/cadastrar')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Cadastro de Usuários"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            alt="Cadastro de Usuários"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Cadastro de Usuários</h2>
                    </div>

                    {/* Card Gerenciar Cardápio */}
                    <div
                        onClick={() => navigate('/cardapio/gerenciar')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Gerenciar Cardápio"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                            alt="Gerenciar Cardápio"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Gerenciar Cardápio</h2>
                    </div>

                    {/* Card Financeiro */}
                    <div
                        onClick={() => navigate('/financeiro')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Controle Financeiro"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2830/2830289.png"
                            alt="Controle Financeiro"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Controle Financeiro</h2>
                    </div>

                    {/* Card Caixa */}
                    <div
                        onClick={() => navigate('/caixa')}
                        className="cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        role="button"
                        aria-label="Controle de Caixa"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1570/1570933.png"
                            alt="Controle de Caixa"
                            className="w-20 h-20 mb-4"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">Controle de Caixa</h2>
                    </div>
                </div>
            </main>

            {/* Rodapé */}
            <footer className="bg-purple-900 text-white py-4 text-center">
                <p className="text-sm">© 2025 Sistema de Loja. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
} 