import { mergeCartItems, readStoredJson, removeCartItemById, updateCartItemsQuantity, writeStoredJson } from "./storage-utils";

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
    return readStoredJson(key, null);
}

function writeJson(key, value) {
    writeStoredJson(key, value);
}

function isExpired(expiresAt) {
    return !expiresAt || expiresAt <= now();
}

function clearIfExpired(mesaId) {
    const key = getTableStorageKey(mesaId);
    const stored = readJson(key);
    if (!stored) {
        return null;
    }

    if (isExpired(stored.expiresAt)) {
        localStorage.removeItem(key);
        return null;
    }

    const cleaned = {
        mesaId: stored.mesaId ?? mesaId,
        expiresAt: buildExpiry(),
        cart: Array.isArray(stored.cart) ? stored.cart : [],
        sessionToken: stored.sessionToken ?? "",
        sessionExpiresAt: stored.sessionExpiresAt ?? null
    };

    writeJson(key, cleaned);
    return cleaned;
}

function createEmptyState(mesaId) {
    return {
        mesaId,
        expiresAt: buildExpiry(),
        cart: [],
        sessionToken: "",
        sessionExpiresAt: null
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
        return existing;
    }

    const initial = createEmptyState(mesaId);
    writeJson(getTableStorageKey(mesaId), initial);
    return initial;
}

export function getActiveTableSession() {
    const session = readJson(ACTIVE_TABLE_KEY);
    if (!session || isExpired(session.expiresAt)) {
        localStorage.removeItem(ACTIVE_TABLE_KEY);
        return null;
    }

    return session;
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
        expiresAt: buildExpiry(),
        cart: Array.isArray(nextState.cart) ? nextState.cart : [],
        sessionToken: nextState.sessionToken ?? "",
        sessionExpiresAt: nextState.sessionExpiresAt ?? null
    };

    writeJson(getTableStorageKey(mesaId), payload);
    writeJson(ACTIVE_TABLE_KEY, { mesaId, expiresAt: payload.expiresAt });
    return payload;
}

export function addItemToTableCart(mesaId, item) {
    const state = getTableOrderState(mesaId);
    const nextCart = mergeCartItems(state.cart, item);
    return saveTableOrderState(mesaId, { ...state, cart: nextCart });
}

export function removeItemFromTableCart(mesaId, itemId) {
    const state = getTableOrderState(mesaId);
    return saveTableOrderState(mesaId, {
        ...state,
        cart: removeCartItemById(state.cart, itemId)
    });
}

export function updateTableCartItemQuantity(mesaId, itemId, quantity) {
    const state = getTableOrderState(mesaId);
    const nextCart = updateCartItemsQuantity(state.cart, itemId, quantity);

    return saveTableOrderState(mesaId, { ...state, cart: nextCart });
}

export function getCurrentTableCartSnapshot(mesaId) {
    const state = getTableOrderState(mesaId);
    const items = state.cart.map((item) => ({ ...item }));
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return {
        mesaId,
        items,
        total
    };
}

export function clearTableCart(mesaId) {
    const state = getTableOrderState(mesaId);
    return saveTableOrderState(mesaId, {
        ...state,
        cart: []
    });
}

export function saveTablePublicSession(mesaId, sessionToken, sessionExpiresAt) {
    const state = getTableOrderState(mesaId);
    return saveTableOrderState(mesaId, {
        ...state,
        sessionToken,
        sessionExpiresAt
    });
}

export function clearTablePublicSession(mesaId) {
    const state = getTableOrderState(mesaId);
    localStorage.removeItem(ACTIVE_TABLE_KEY);
    localStorage.removeItem(getTableStorageKey(mesaId));
    return createEmptyState(mesaId);
}
