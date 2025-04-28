import { theme } from '../theme';
import { useNavigate } from 'react-router-dom';

export default function PainelPage() {
    const navigate = useNavigate();
    const nome = localStorage.getItem('nome') || 'Usuário';
    const role = localStorage.getItem('role') || '';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.cores.fundo} p-8 flex flex-col items-center`}>
            <h1 className="text-4xl font-bold mb-8" style={{ color: theme.cores.primaria }}>
                {theme.textos.saudacaoPainel}, {nome}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {/* Card Estoque */}
                <div
                    onClick={() => navigate('/estoque/listar')}
                    className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                    <div className="text-5xl mb-4" style={{ color: theme.cores.primaria }}>📦</div>
                    <h2 className="text-xl font-bold" style={{ color: theme.cores.primaria }}>Gerenciar Estoque</h2>
                </div>

                {/* Card Pedidos */}
                <div
                    onClick={() => navigate('/pedidos')}
                    className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                    <div className="text-5xl mb-4" style={{ color: theme.cores.primaria }}>🛒</div>
                    <h2 className="text-xl font-bold" style={{ color: theme.cores.primaria }}>Visualizar Pedidos</h2>
                </div>

                {/* Card Relatórios */}
                <div
                    onClick={() => navigate('/relatorios')}
                    className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                    <div className="text-5xl mb-4" style={{ color: theme.cores.primaria }}>📊</div>
                    <h2 className="text-xl font-bold" style={{ color: theme.cores.primaria }}>Relatórios Financeiros</h2>
                </div>
            </div>
        </div>
    );
}
