// src/layouts/DashboardLayout.jsx

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, LogOut, PackagePlus, List, ArrowDownCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { theme } from '../theme';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Painel', path: '/painel' },
        { label: 'Controle de Pedidos', path: '/pedidos' },
        { label: 'Cadastrar Produto', path: '/estoque/cadastrar' },
        { label: 'Listar Estoque', path: '/estoque/listar' },
        { label: 'Controle de Caixa', path: '/caixa' }, // futura
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-800 to-purple-400">
            {/* Sidebar */}
            <aside className={`bg-purple-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} flex flex-col`}>
                <div className="flex items-center justify-between p-4">
                    <img src={logo} alt="Logo" className="h-8" />
                    <button onClick={toggleSidebar}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {sidebarOpen && (
                    <h1 className="text-center text-lg font-bold mb-4">{theme.nomeEmpresa}</h1>
                )}

                <nav className="flex flex-col gap-2 px-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${location.pathname.startsWith(item.path)
                                    ? 'bg-purple-600'
                                    : 'hover:bg-purple-700 text-purple-200'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded-md justify-center"
                    >
                        <LogOut size={16} />
                        {sidebarOpen && 'Sair'}
                    </button>
                </div>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
