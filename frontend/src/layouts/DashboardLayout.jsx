import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { PackagePlus, List, ArrowDownCircle, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const menuItems = [
        { label: 'Cadastrar', to: '/estoque/cadastrar', icon: <PackagePlus size={16} /> },
        { label: 'Listar', to: '/estoque/listar', icon: <List size={16} /> },
        { label: 'Dar Baixa', to: '/estoque/baixa', icon: <ArrowDownCircle size={16} /> },
    ];

    return (
        <div className="flex min-h-screen font-poppins bg-gradient-to-br from-purple-800 to-purple-400 text-white">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-purple-900 p-4 flex flex-col gap-4`}>
                <button
                    onClick={toggleSidebar}
                    className="mb-4 text-white self-end focus:outline-none"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" className="w-10 mx-auto mb-2" />
                    {sidebarOpen && <h1 className="text-lg font-bold">Estoque</h1>}
                </div>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${location.pathname === item.to
                                    ? 'bg-purple-600 text-white'
                                    : 'hover:bg-purple-700 text-purple-200'
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-10 overflow-x-auto">
                <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-[1200px] min-w-[360px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
