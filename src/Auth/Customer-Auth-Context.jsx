import { createContext, useContext, useEffect, useState } from "react";
import { getCustomerProfile } from "../services/customer-account";
import { deleteCustomerToken, getCustomerToken } from "../services/customer-token-storage";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
    const [token, setToken] = useState(() => getCustomerToken());
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async (tokenValue = token?.token) => {
        if (!tokenValue) {
            setCustomer(null);
            setLoading(false);
            return null;
        }

        setLoading(true);
        try {
            const response = await getCustomerProfile(tokenValue);
            const profile = response?.data ?? null;
            setCustomer(profile);
            return profile;
        } catch {
            deleteCustomerToken();
            setToken(getCustomerToken());
            setCustomer(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const sync = () => setToken(getCustomerToken());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    useEffect(() => {
        refreshProfile(token?.token);
    }, [token]);

    const logout = () => {
        deleteCustomerToken();
        setToken(getCustomerToken());
        setCustomer(null);
    };

    return (
        <CustomerAuthContext.Provider value={{ customer, token, loading, hasCustomerSession: Boolean(token?.token), logout, refreshProfile, setCustomer }}>
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext);
    if (!context)
        throw new Error("useCustomerAuth debe usarse dentro de CustomerAuthProvider");
    return context;
}
