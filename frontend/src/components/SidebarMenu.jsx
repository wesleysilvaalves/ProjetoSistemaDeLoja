import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiLogOut, FiMenu } from 'react-icons/fi';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import logo from '../assets/logo.png'; // Importe o logo correto

export default function SidebarMenu({ menuItems = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    // Função para determinar se um item está ativo com base na URL atual
    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    return (
        <aside className={`bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white flex flex-col justify-between shadow-lg transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div>
                <div className="flex flex-col items-center py-8">
                    <img src={logo} alt="Logo" className="h-12 mb-2" />
                    {!collapsed && <h1 className="text-lg font-bold mb-6">Parada do Açaí</h1>}
                    <button
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-900 dark:hover:bg-gray-800 transition mb-4"
                        onClick={() => setCollapsed(!collapsed)}
                        title="Recolher menu"
                    >
                        <FiMenu /> {!collapsed && 'Recolher menu'}
                    </button>
                </div>
                <nav className="flex flex-col gap-2 px-4">
                    <button
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-900 dark:hover:bg-gray-800 transition"
                        onClick={() => navigate('/painel')}
                    >
                        <FiChevronLeft /> {!collapsed && 'Voltar ao Painel'}
                    </button>
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-900 dark:hover:bg-gray-800 transition ${isActive(item.path) ? 'bg-purple-900 dark:bg-gray-800' : ''}`}
                        >
                            {item.icon && <span>{item.icon}</span>}
                            {!collapsed && item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 space-y-2">
                {/* Botão Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full bg-purple-700 dark:bg-gray-700 hover:bg-purple-800 dark:hover:bg-gray-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    {!collapsed && (theme === 'light' ? 'Modo Escuro' : 'Modo Claro')}
                </button>

                {/* Botão Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <FiLogOut /> {!collapsed && 'Sair'}
                </button>
            </div>
        </aside>
    );
}