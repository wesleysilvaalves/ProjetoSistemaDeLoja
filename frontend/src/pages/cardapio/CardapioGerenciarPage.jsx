import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { BookOpen, List } from 'lucide-react';
import logo from '../../assets/logo.png';

const menuItems = [
    { label: 'Gerenciar Cardápio', path: '/cardapio/gerenciar', icon: <BookOpen size={16} /> },
    { label: 'Listar Itens', path: '/cardapio/listar', icon: <List size={16} /> },
];

export default function CardapioGerenciarPage() {
    const [form, setForm] = useState({ nome: '', preco: '' });
    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensagem('Item cadastrado no cardápio! (mock)');
        setForm({ nome: '', preco: '' });
    };

    return (
        <DashboardLayout menuItems={menuItems} titulo="Gerenciar Cardápio" logo={logo}>
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do item" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500" required />
                <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preço" type="number" step="0.01" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500" required />
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition">Cadastrar</button>
                {mensagem && <div className="mt-4 text-center text-green-700 font-semibold">{mensagem}</div>}
            </form>
        </DashboardLayout>
    );
} 