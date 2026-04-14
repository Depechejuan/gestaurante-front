const STORAGE_KEY = "gestaurante.online.checkout.preferences";

const defaultPreferences = {
    tipoEntrega: "RECOGIDA",
    pagarOnline: false,
    selectedAddress: "",
    selectedPaymentMethod: "",
    useSavedPaymentMethod: true
};

export function getOnlineCheckoutPreferences() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return { ...defaultPreferences };

        const parsed = JSON.parse(raw);
        return {
            ...defaultPreferences,
            ...parsed
        };
    } catch {
        return { ...defaultPreferences };
    }
}

export function saveOnlineCheckoutPreferences(preferences) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...defaultPreferences,
        ...preferences
    }));
}

export function clearOnlineCheckoutPreferences() {
    window.localStorage.removeItem(STORAGE_KEY);
}
