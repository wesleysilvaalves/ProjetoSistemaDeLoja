// src/layouts/DashboardLayout.jsx

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, ShoppingCart, PackagePlus, ListOrdered, DollarSign, ChevronsLeft, ChevronsRight, Home, BarChart, PieChart, LineChart } from 'lucide-react';
import logo from '../assets/logo.png';
import { theme } from '../theme';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(true);

    const role = localStorage.getItem('role');
    const currentPath = location.pathname;

    // Determinar se deve mostrar a sidebar e quais menus mostrar
    useEffect(() => {
        // Ocultar sidebar na página inicial/painel
        if (currentPath === '/painel') {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    }, [currentPath]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Determinar quais itens de menu mostrar baseado na rota atual
    const getMenuItems = () => {
        // Menu para o módulo de Estoque
        if (currentPath.includes('/estoque')) {
            return [
                { label: 'Voltar ao Painel', path: '/painel', icon: <Home size={20} /> },
                { label: 'Cadastrar Produto', path: '/estoque/cadastrar', icon: <PackagePlus size={20} /> },
                { label: 'Listar Estoque', path: '/estoque/listar', icon: <ListOrdered size={20} /> },
            ];
        }
        
        // Menu para o módulo de Pedidos
        if (currentPath.includes('/pedidos')) {
            return [
                { label: 'Voltar ao Painel', path: '/painel', icon: <Home size={20} /> },
                { label: 'Controle de Pedidos', path: '/pedidos', icon: <ShoppingCart size={20} /> },
                { label: 'Fazer Novo Pedido', path: '/fazer-pedido', icon: <PackagePlus size={20} /> },
            ];
        }
        
        // Menu para o módulo de Caixa (futuro)
        if (currentPath.includes('/caixa')) {
            return [
                { label: 'Voltar ao Painel', path: '/painel', icon: <Home size={20} /> },
                { label: 'Controle de Caixa', path: '/caixa', icon: <DollarSign size={20} /> },
            ];
        }
        
        // Menu para o módulo de Relatórios Financeiros
        if (currentPath.includes('/relatorios')) {
            return [
                { label: 'Voltar ao Painel', path: '/painel', icon: <Home size={20} /> },
                { label: 'Visão Geral', path: '/relatorios', icon: <BarChart size={20} /> },
                { label: 'Vendas por Produto', path: '/relatorios/produtos', icon: <PieChart size={20} /> },
                { label: 'Rendimento Mensal', path: '/relatorios/mensal', icon: <LineChart size={20} /> },
            ];
        }
        
        // Menu padrão
        return [
            { label: 'Painel', path: '/painel', icon: <LayoutDashboard size={20} /> },
            { label: 'Controle de Pedidos', path: '/pedidos', icon: <ShoppingCart size={20} /> },
            { label: 'Estoque', path: '/estoque/listar', icon: <ListOrdered size={20} /> },
            { label: 'Relatórios Financeiros', path: '/relatorios', icon: <BarChart size={20} /> },
            { label: 'Controle de Caixa', path: '/caixa', icon: <DollarSign size={20} /> },
        ];
    };

    const menuItems = getMenuItems();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-800 to-purple-400">
            {/* Sidebar - condicional */}
            {showSidebar && (
                <aside className={`bg-purple-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} flex flex-col`}>
                    <div className={`flex items-center justify-center p-4 ${sidebarOpen && 'justify-between'}`}>
                        <img src={logo} alt="Logo" className="h-8" />
                        {sidebarOpen && (
                            <h1 className="text-lg font-bold ml-2">{theme.nomeEmpresa}</h1>
                        )}
                    </div>

                    <nav className={`flex flex-col gap-3 ${sidebarOpen ? 'px-4' : 'px-2'} mt-2`}>
                        {/* Botão de toggle da sidebar */}
                        <button
                            onClick={toggleSidebar}
                            className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-2 rounded-md transition hover:bg-purple-700 text-purple-200 border border-purple-700`}
                            title={sidebarOpen ? "Recolher menu" : "Expandir menu"}
                        >
                            {sidebarOpen ? (
                                <>
                                    <span>Recolher menu</span>
                                    <ChevronsLeft size={20} />
                                </>
                            ) : (
                                <ChevronsRight size={20} />
                            )}
                        </button>

                        {/* Itens de menu baseados no módulo atual */}
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-2 p-2 rounded-md transition ${
                                    location.pathname.startsWith(item.path) && item.path !== '/painel'
                                        ? 'bg-purple-600'
                                        : 'hover:bg-purple-700 text-purple-200'
                                }`}
                                title={!sidebarOpen ? item.label : ""}
                            >
                                {item.icon}
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>

                    <div className={`mt-auto ${sidebarOpen ? 'p-4' : 'p-2 mb-4'}`}>
                        <button
                            onClick={logout}
                            className={`flex items-center ${sidebarOpen ? 'justify-center gap-2' : 'justify-center'} w-full bg-red-600 hover:bg-red-700 p-2 rounded-md`}
                            title={!sidebarOpen ? "Sair" : ""}
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Sair</span>}
                        </button>
                    </div>
                </aside>
            )}

            {/* Conteúdo */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
