const ACTIVE_TABLE_KEY = "GST_ACTIVE_TABLE";
const TABLE_ORDER_PREFIX = "GST_TABLE_ORDER_";
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function now() {
    return Date.now();
}

function buildExpiry() {
    return now() + FOUR_HOURS_MS;
}

function getTableStorageKey(mesaId) {
    return `${TABLE_ORDER_PREFIX}${mesaId}`;
}

function readJson(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function clearIfExpired(mesaId) {
    const key = getTableStorageKey(mesaId);
    const stored = readJson(key);
    if (!stored) return null;

    if (!stored.expiresAt || stored.expiresAt <= now()) {
        localStorage.removeItem(key);
        return null;
    }

    return stored;
}

function createEmptyState(mesaId) {
    return {
        mesaId,
        expiresAt: buildExpiry(),
        cart: [],
        previousOrders: []
    };
}

export function startTableSession(mesaId) {
    const activeSession = {
        mesaId,
        expiresAt: buildExpiry()
    };

    writeJson(ACTIVE_TABLE_KEY, activeSession);

    const existing = clearIfExpired(mesaId);
    if (existing) {
        const refreshed = { ...existing, expiresAt: buildExpiry() };
        writeJson(getTableStorageKey(mesaId), refreshed);
        return refreshed;
    }

    const initial = createEmptyState(mesaId);
    writeJson(getTableStorageKey(mesaId), initial);
    return initial;
}

export function getTableOrderState(mesaId) {
    const stored = clearIfExpired(mesaId);
    if (!stored) {
        return startTableSession(mesaId);
    }

    return stored;
}

export function saveTableOrderState(mesaId, nextState) {
    const payload = {
        ...nextState,
        mesaId,
        expiresAt: buildExpiry()
    };

    writeJson(getTableStorageKey(mesaId), payload);
    writeJson(ACTIVE_TABLE_KEY, { mesaId, expiresAt: payload.expiresAt });
    return payload;
}

export function addItemToTableCart(mesaId, item) {
    const state = getTableOrderState(mesaId);
    const existingIndex = state.cart.findIndex((cartItem) => cartItem.id === item.id);
    const nextCart = [...state.cart];

    if (existingIndex >= 0) {
        const existing = nextCart[existingIndex];
        nextCart[existingIndex] = {
            ...existing,
            quantity: existing.quantity + item.quantity
        };
    } else {
        nextCart.push(item);
    }

    return saveTableOrderState(mesaId, { ...state, cart: nextCart });
}

export function removeItemFromTableCart(mesaId, itemId) {
    const state = getTableOrderState(mesaId);
    return saveTableOrderState(mesaId, {
        ...state,
        cart: state.cart.filter((item) => item.id !== itemId)
    });
}

export function updateTableCartItemQuantity(mesaId, itemId, quantity) {
    const state = getTableOrderState(mesaId);
    const nextCart = state.cart
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

    return saveTableOrderState(mesaId, { ...state, cart: nextCart });
}

export function submitCurrentTableOrder(mesaId) {
    const state = getTableOrderState(mesaId);
    if (!state.cart.length) return state;

    const total = state.cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const order = {
        id: `pedido-${Date.now()}`,
        createdAt: new Date().toISOString(),
        items: state.cart,
        total
    };

    return saveTableOrderState(mesaId, {
        ...state,
        cart: [],
        previousOrders: [order, ...state.previousOrders]
    });
}
