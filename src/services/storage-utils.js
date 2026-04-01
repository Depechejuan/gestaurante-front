export function getStoredValue(key) {
    if (typeof window === "undefined")
        return null;

    return localStorage.getItem(key);
}

export function setStoredValue(key, value) {
    if (typeof window === "undefined")
        return;

    localStorage.setItem(key, value);
}

export function removeStoredValue(key) {
    if (typeof window === "undefined")
        return;

    localStorage.removeItem(key);
}

export function readStoredJson(key, fallback = null) {
    const raw = getStoredValue(key);
    if (!raw)
        return fallback;

    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function writeStoredJson(key, value) {
    setStoredValue(key, JSON.stringify(value));
}

export function mergeCartItems(items, item) {
    const next = [...items];
    const index = next.findIndex((entry) => entry.id === item.id);

    if (index >= 0) {
        next[index] = {
            ...next[index],
            quantity: next[index].quantity + item.quantity
        };
        return next;
    }

    next.push(item);
    return next;
}

export function updateCartItemsQuantity(items, itemId, quantity) {
    return items
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
}

export function removeCartItemById(items, itemId) {
    return items.filter((item) => item.id !== itemId);
}
