import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Settings } from 'react-icons/fa';

const linksPorTipo = {
    admin: [
        { to: '/painel', label: 'Painel' },
        { to: '/estoque', label: 'Estoque' },
        { to: '/pedidos', label: 'Pedidos' },
        { to: '/caixa', label: 'Caixa' },
        { to: '/financeiro', label: 'Financeiro' },
        { to: '/relatorios', label: 'Relatórios' },
        { to: '/usuarios', label: 'Usuários' },
        { to: '/cardapio', label: 'Cardápio' },
        { to: '/configuracao', label: 'Configurações', icon: <Settings size={20} /> },
    ],
    gerente: [
        { to: '/painel', label: 'Painel' },
        { to: '/estoque', label: 'Estoque' },
        { to: '/pedidos', label: 'Pedidos' },
        { to: '/caixa', label: 'Caixa' },
        { to: '/financeiro', label: 'Financeiro' },
        { to: '/relatorios', label: 'Relatórios' },
        { to: '/cardapio', label: 'Cardápio' },
        { to: '/configuracao', label: 'Configurações', icon: <Settings size={20} /> },
    ],
    atendente: [
        { to: '/painel', label: 'Painel' },
        { to: '/pedidos', label: 'Pedidos' },
        { to: '/caixa', label: 'Caixa' },
        { to: '/cardapio', label: 'Cardápio' },
        { to: '/configuracao', label: 'Configurações', icon: <Settings size={20} /> },
    ],
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    if (!user) return null;
    const links = linksPorTipo[user.tipo] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col">
            <div className="p-6 font-bold text-xl border-b">Sistema de Loja</div>
            <nav className="flex-1 p-4">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`block px-4 py-2 rounded mb-2 transition-colors ${location.pathname.startsWith(link.to) ? 'bg-purple-600 text-white' : 'hover:bg-purple-100'}`}
                    >
                        {link.icon && <span className="mr-2">{link.icon}</span>}
                        {link.label}
                    </Link>
                ))}
            </nav>
            <button
                onClick={handleLogout}
                className="m-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Sair
            </button>
        </aside>
    );
}