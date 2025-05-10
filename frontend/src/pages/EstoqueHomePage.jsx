import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EstoqueHomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/estoque/cadastrar', { replace: true });
    }, [navigate]);
    return null;
}