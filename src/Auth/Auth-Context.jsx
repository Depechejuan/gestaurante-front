import { createContext, useState, useEffect, useContext } from "react";
import getToken from "../services/get-token";
import { getAuthenticatedEmployeeProfile } from "../services/empleados";
import { SESSION_CHANGED_EVENT } from "../services/session-events";
import deleteToken from "../services/delete-token";
import { extractEmployeeRoleFromJwt, resolveEmployeeRoleName } from "../constants/roles";

export const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth debe usarse dentro de AuthProvider");
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
                const userData = await getAuthenticatedEmployeeProfile(token);
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
        deleteToken();
        setToken(getToken());
        setUser(null);
    };

    const roleName = user
        ? resolveEmployeeRoleName(user.tipo)
        : extractEmployeeRoleFromJwt(token?.token);
    const displayName = user
        ? [user.nombre, user.apellido1, user.apellido2].filter(Boolean).join(" ").trim() || user.email || roleName
        : null;

    return (
        <AuthContext.Provider value={{ user, loading, logout, roleName, displayName, hasToken, sessionUserId: user?.id ?? token?.id ?? null }}>
            {children}
        </AuthContext.Provider>
    );
}
