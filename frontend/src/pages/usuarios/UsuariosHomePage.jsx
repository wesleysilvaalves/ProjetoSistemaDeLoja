import { Link, Outlet } from 'react-router-dom';

export default function UsuariosHomePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Usuários</h1>
            <nav className="mb-4 flex gap-4">
                <Link to="cadastrar" className="px-4 py-2 bg-purple-600 text-white rounded">Cadastrar Usuário</Link>
                <Link to="listar" className="px-4 py-2 bg-purple-600 text-white rounded">Listar Usuários</Link>
            </nav>
            <Outlet />
        </div>
    );
} 