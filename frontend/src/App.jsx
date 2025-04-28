import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginPage from './pages/LoginPage';
import EstoqueCadastroPage from './pages/EstoqueCadastroPage';
import EstoqueListagemPage from './pages/EstoqueListagemPage';
import PainelPage from './pages/PainelPage';
import DashboardLayout from './layouts/DashboardLayout';
import PedidoPage from './pages/PedidoPage'; // Tela de fazer pedido (cliente)
import PedidosControlePage from './pages/PedidosControlePage'; // Tela de controle de pedidos (admin)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Atualizar quando o localStorage mudar
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setIsAuthenticated(!!token);
      setRole(userRole);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={role === 'admin' ? '/painel' : '/estoque/listar'} />
          ) : (
            <LoginPage />
          )
        } />

        {isAuthenticated && (
          <>
            <Route path="/painel" element={<PainelPage />} />
            <Route path="/pedidos" element={<PedidosControlePage />} /> {/* Controle de pedidos */}
            <Route path="/estoque" element={<DashboardLayout />}>
              <Route path="cadastrar" element={<EstoqueCadastroPage />} />
              <Route path="listar" element={<EstoqueListagemPage />} />
            </Route>
          </>
        )}

        {/* A tela de fazer pedido fica pública (cliente pode acessar sem login) */}
        <Route path="/fazer-pedido" element={<PedidoPage />} />

        {/* Rota coringa */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
