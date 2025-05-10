import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConfiguracaoProvider } from './contexts/ConfiguracaoContext';
import DashboardLayout from './layouts/DashboardLayout';
import PainelPage from './pages/PainelPage';
import EstoqueCadastroPage from './pages/estoque/EstoqueCadastroPage';
import EstoqueListagemPage from './pages/estoque/EstoqueListagemPage';
import EstoqueBaixaPage from './pages/estoque/EstoqueBaixaPage';
import LoginPage from './pages/LoginPage';
import ConfiguracaoPage from './pages/configuracao/ConfiguracaoPage';
import EstoqueHistoricoPage from './pages/estoque/EstoqueHistoricoPage';
import { PackagePlus, List, ArrowDownCircle, Settings } from 'lucide-react';

export default function App() {
  const estoqueMenuItems = [
    { label: 'Cadastrar Produto', path: '/estoque/cadastrar', icon: <PackagePlus size={16} /> },
    { label: 'Listar Estoque', path: '/estoque/listar', icon: <List size={16} /> },
    { label: 'Dar Baixa', path: '/estoque/baixa', icon: <ArrowDownCircle size={16} /> },
    { label: 'Histórico', path: '/estoque/historico', icon: <List size={16} /> },
  ];

  const configMenuItems = [
    { label: 'Configurações', path: '/configuracao', icon: <Settings size={16} /> },
  ];

  return (
    <ThemeProvider>
      <ConfiguracaoProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Rota para o painel principal */}
            <Route path="/" element={<Navigate to="/painel" replace />} />
            <Route path="/painel" element={<PainelPage />} />

            {/* Rotas de estoque */}
            <Route path="/estoque" element={<DashboardLayout menuItems={estoqueMenuItems} titulo="Gerenciamento de Estoque" />}>
              <Route index element={<Navigate to="/estoque/cadastrar" replace />} />
              <Route path="cadastrar" element={<EstoqueCadastroPage />} />
              <Route path="listar" element={<EstoqueListagemPage />} />
              <Route path="baixa" element={<EstoqueBaixaPage />} />
              <Route path="editar/:id" element={<EstoqueCadastroPage />} />
              <Route path="historico" element={<EstoqueHistoricoPage />} />
            </Route>

            {/* Rota de configuração */}
            <Route path="/configuracao" element={
              <DashboardLayout menuItems={configMenuItems} titulo="Configuração do Sistema">
                <ConfiguracaoPage />
              </DashboardLayout>
            } />
          </Routes>
        </AuthProvider>
      </ConfiguracaoProvider>
    </ThemeProvider>
  );
}
