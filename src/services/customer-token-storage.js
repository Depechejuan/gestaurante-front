import { clearStoredSession, getStoredSession, saveStoredSession } from "./auth-storage";

const TOKEN_KEY = "GST_CUSTOMER_TOKEN";
const ID_KEY = "GST_CUSTOMER_ID";

export function saveCustomerToken(response) {
    saveStoredSession(TOKEN_KEY, ID_KEY, response.token, response.idUsuarioCliente, true);
}

export function getCustomerToken() {
    return getStoredSession(TOKEN_KEY, ID_KEY);
}

export function deleteCustomerToken() {
    clearStoredSession(TOKEN_KEY, ID_KEY, true);
}
