// src/layouts/DashboardLayout.jsx

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { theme } from '../theme'; // Agora puxamos tudo do theme

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const role = localStorage.getItem('role');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Monta os menus dependendo do tipo de role
    const menuItems = [];

    if (role === 'admin' || role === 'estoquista') {
        menuItems.push(
            { label: 'Cadastrar Produto', to: '/estoque/cadastrar' },
            { label: 'Listar Estoque', to: '/estoque/listar' },
            { label: 'Controle de Pedidos', to: '/pedidos' }
        );
    }

    if (role === 'admin' || role === 'caixa') {
        menuItems.push(
            { label: 'Controle de Caixa', to: '/caixa' } // futura funcionalidade
        );
    }

    return (
        <div className="flex min-h-screen font-poppins bg-gradient-to-br from-purple-800 to-purple-400 text-white">

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-purple-900 p-4 flex flex-col justify-between`}>
                <div>
                    {/* Botão de abrir/fechar */}
                    <button
                        onClick={toggleSidebar}
                        className="text-white mb-4 focus:outline-none self-end"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo e Nome da Empresa */}
                    <div className="text-center mb-6">
                        <img
                            src={theme.logo}
                            alt="Logo"
                            className="mx-auto mb-2 w-10 h-10 object-contain"
                        />
                        {sidebarOpen && (
                            <h1 className="text-lg font-bold">{theme.nomeEmpresa}</h1>
                        )}
                    </div>

                    {/* Menus */}
                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${location.pathname.startsWith(item.to)
                                    ? 'bg-purple-700 text-white'
                                    : 'hover:bg-purple-700 text-purple-200'
                                    }`}
                            >
                                {/* Ícone do menu poderia ser adicionado aqui futuramente */}
                                {sidebarOpen && item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Botão de sair */}
                <div className="mt-6">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-bold transition"
                    >
                        <LogOut size={16} />
                        {sidebarOpen && "Sair"}
                    </button>
                </div>
            </aside>

            {/* Área principal */}
            <main className="flex-1 flex flex-col p-6 md:p-10 overflow-x-auto">
                <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-7xl min-w-[360px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
