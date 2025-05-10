import { Link, Outlet } from 'react-router-dom';

export default function FinanceiroHomePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Financeiro</h1>
            <nav className="mb-4 flex gap-4">
                <Link to="lancamentos" className="px-4 py-2 bg-purple-600 text-white rounded">Lançamentos</Link>
                <Link to="relatorios" className="px-4 py-2 bg-purple-600 text-white rounded">Relatórios</Link>
            </nav>
            <Outlet />
        </div>
    );
} 