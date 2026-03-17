import { createContext, useState, useEffect, useContext } from "react";
import getToken from "../services/get-token";
import getBasicUser from "../services/get-basic-user";

export const AuthContext = createContext(null);
const roleMap = {
    0: "Administrador",
    1: "Camarero",
    2: "Cocinero"
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(getToken());
    const hasToken = Boolean(token?.token && token?.id);

    useEffect(() => {
        if (!hasToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            setLoading(true);
            try {
                const userData = await getBasicUser(token);
                setUser(userData.data ?? null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token, hasToken]);

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const roleName = user ? roleMap[user.tipo] ?? "Sin rol" : null;

    return (
        <AuthContext.Provider value={{ user, loading, logout, roleName, hasToken, sessionUserId: user?.id ?? token?.id ?? null }}>
            {children}
        </AuthContext.Provider>
    );
}
