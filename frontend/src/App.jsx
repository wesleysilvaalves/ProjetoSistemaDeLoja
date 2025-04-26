import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EstoqueCadastroPage from './pages/EstoqueCadastroPage';
import EstoqueListagemPage from './pages/EstoqueListagemPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/estoque" element={<DashboardLayout />}>
          <Route path="cadastrar" element={<EstoqueCadastroPage />} />
          <Route path="listar" element={<EstoqueListagemPage />} />
          {/* Coloque outras rotas como dar baixa aqui */}
        </Route>
      </Routes>
    </Router>
  );
}
