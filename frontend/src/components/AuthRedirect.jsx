import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AuthRedirect({ children }) {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/painel" replace />;
    }
    return children;
} 