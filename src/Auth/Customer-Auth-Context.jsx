import { createContext, useContext, useEffect, useState } from "react";
import { getCustomerProfile } from "../services/customer-account";
import { deleteCustomerToken, getCustomerToken } from "../services/customer-token-storage";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
    const [token, setToken] = useState(() => getCustomerToken());
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sync = () => setToken(getCustomerToken());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            if (!token?.token) {
                setCustomer(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getCustomerProfile(token.token);
                setCustomer(response?.data ?? null);
            } catch {
                deleteCustomerToken();
                setToken(getCustomerToken());
                setCustomer(null);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [token]);

    const logout = () => {
        deleteCustomerToken();
        setToken(getCustomerToken());
        setCustomer(null);
    };

    return (
        <CustomerAuthContext.Provider value={{ customer, token, loading, hasCustomerSession: Boolean(token?.token), logout }}>
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error("useCustomerAuth debe usarse dentro de CustomerAuthProvider");
    }
    return context;
}
