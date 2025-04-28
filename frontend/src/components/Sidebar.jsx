// src/components/Sidebar.jsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const sair = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Painel', path: '/painel' },
        { name: 'Pedidos', path: '/pedidos' },
        { name: 'Cadastrar Produto', path: '/estoque/cadastrar' },
        { name: 'Listar Estoque', path: '/estoque/listar' },
    ];

    return (
        <div className={`min-h-screen w-64 bg-gradient-to-br ${theme.cores.sidebarFundo} text-white flex flex-col justify-between`}>
            {/* Topo */}
            <div className="px-4 pt-6">
                <div className="flex justify-center mb-4">
                    <img
                        src={theme.logo}
                        alt="Logo"
                        className="h-16 object-contain"
                    />
                </div>

                <h1 className="text-center text-lg font-bold mb-8">
                    {theme.nomeEmpresa}
                </h1>

                {/* Navegacao */}
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`p-2 rounded-lg text-left transition-all ${location.pathname.startsWith(item.path) ? theme.cores.sidebarItemAtivo : theme.cores.sidebarItem}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Botao sair */}
            <div className="p-4">
                <button
                    onClick={sair}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition-all"
                >
                    Sair
                </button>
            </div>
        </div>
    );
}
