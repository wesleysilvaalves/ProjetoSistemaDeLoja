import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ThemeAndLogoutButtons() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className="fixed bottom-4 left-4 space-y-2 z-10">
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 bg-purple-700 dark:bg-gray-700 hover:bg-purple-800 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold w-full shadow-lg"
            >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="whitespace-nowrap">Modo Escuro</span>
            </button>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold w-full shadow-lg"
            >
                <LogOut size={16} /> Sair
            </button>
        </div>
    );
}