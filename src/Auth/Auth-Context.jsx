import { createContext, useState, useEffect, useContext } from "react";
import getToken from "../services/get-token";
import getBasicUser from "../services/get-basic-user";

export const AuthContext = createContext(null);

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
    const [token, setToken] = useState(() => getToken());


    useEffect(() => {
        if (!token) {
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
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
