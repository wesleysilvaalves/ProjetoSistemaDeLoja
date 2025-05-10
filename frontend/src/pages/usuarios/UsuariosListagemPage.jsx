const usuariosMock = [
    { id: 1, nome: 'Admin', email: 'admin@acai.com', tipo: 'admin' },
    { id: 2, nome: 'Gerente', email: 'gerente@acai.com', tipo: 'gerente' },
    { id: 3, nome: 'Atendente', email: 'atendente@acai.com', tipo: 'atendente' },
];

export default function UsuariosListagemPage() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Usuários Cadastrados</h2>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nome</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosMock.map((u) => (
                        <tr key={u.id}>
                            <td className="border px-4 py-2">{u.nome}</td>
                            <td className="border px-4 py-2">{u.email}</td>
                            <td className="border px-4 py-2">{u.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 