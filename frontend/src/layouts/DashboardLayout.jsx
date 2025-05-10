import React, { useContext } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

export default function DashboardLayout({ menuItems = [], titulo = '', mostrarSucesso = false }) {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-800 to-purple-500 dark:from-gray-900 dark:to-gray-800 text-white font-poppins">
            <SidebarMenu menuItems={menuItems} />

            <main className="flex-1 p-6 relative">
                <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-xl">
                    {titulo && <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-6">{titulo}</h1>}
                    <Outlet />
                </div>
            </main>

            {mostrarSucesso && (
                <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white flex items-center gap-3">
                    <CheckCircle size={20} />
                    Produto cadastrado com sucesso!
                </div>
            )}
        </div>
    );
}
