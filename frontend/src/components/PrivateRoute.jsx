import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Carregando...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
