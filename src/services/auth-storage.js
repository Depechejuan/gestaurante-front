import { dispatchSessionChanged } from "./session-events";
import { getStoredValue, removeStoredValue, setStoredValue } from "./storage-utils";

export function getStoredSession(tokenKey, idKey) {
    return {
        token: getStoredValue(tokenKey),
        id: getStoredValue(idKey)
    };
}

export function saveStoredSession(tokenKey, idKey, token, id, emitStorage = false) {
    setStoredValue(tokenKey, token);
    setStoredValue(idKey, id);
    dispatchSessionChanged();

    if (emitStorage && typeof window !== "undefined")
        window.dispatchEvent(new Event("storage"));
}

export function clearStoredSession(tokenKey, idKey, emitStorage = false) {
    removeStoredValue(tokenKey);
    removeStoredValue(idKey);
    dispatchSessionChanged();

    if (emitStorage && typeof window !== "undefined")
        window.dispatchEvent(new Event("storage"));
}
