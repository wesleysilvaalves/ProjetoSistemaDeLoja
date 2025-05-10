import { createContext, useState, useEffect } from "react";
import { getUserFromStorage, setUserToStorage, removeUserFromStorage } from '../services/authStorage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUserFromStorage());

    useEffect(() => {
        setUser(getUserFromStorage());
    }, []);

    const login = (userData, token) => {
        setUserToStorage(userData, token);
        setUser(userData);
    };

    const logout = () => {
        removeUserFromStorage();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
} 