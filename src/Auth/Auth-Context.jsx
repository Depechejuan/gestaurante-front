import { createContext, useState, useEffect, useContext } from "react";
import getToken from "../services/get-token";
import getBasicUser from "../services/get-basic-user";
import { SESSION_CHANGED_EVENT } from "../services/session-events";
import deleteToken from "../services/delete-token";

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
        const syncSession = () => {
            setToken(getToken());
        };

        window.addEventListener(SESSION_CHANGED_EVENT, syncSession);
        window.addEventListener("storage", syncSession);

        return () => {
            window.removeEventListener(SESSION_CHANGED_EVENT, syncSession);
            window.removeEventListener("storage", syncSession);
        };
    }, []);

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
                const nextUser = userData?.data ?? null;

                if (!nextUser) {
                    deleteToken();
                    setUser(null);
                    setToken(getToken());
                    return;
                }

                setUser(nextUser);
            } catch {
                deleteToken();
                setUser(null);
                setToken(getToken());
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token, hasToken]);

    const logout = () => {
        setToken(getToken());
        setUser(null);
    };

    const roleName = user ? roleMap[user.tipo] ?? "Sin rol" : null;

    return (
        <AuthContext.Provider value={{ user, loading, logout, roleName, hasToken, sessionUserId: user?.id ?? token?.id ?? null }}>
            {children}
        </AuthContext.Provider>
    );
}
