import { Link, Outlet } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function CardapioHomePage() {
    return (
        <DashboardLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Cardápio</h1>
                <nav className="mb-4 flex gap-4">
                    <Link to="gerenciar" className="px-4 py-2 bg-purple-600 text-white rounded">Gerenciar Cardápio</Link>
                    <Link to="listar" className="px-4 py-2 bg-purple-600 text-white rounded">Listar Itens</Link>
                </nav>
                <Outlet />
            </div>
        </DashboardLayout>
    );
} 