const TOKEN_KEY = "GST_CUSTOMER_TOKEN";
const ID_KEY = "GST_CUSTOMER_ID";

export function saveCustomerToken(response) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(ID_KEY, response.idUsuarioCliente);
    window.dispatchEvent(new Event("storage"));
}

export function getCustomerToken() {
    return {
        token: localStorage.getItem(TOKEN_KEY),
        id: localStorage.getItem(ID_KEY)
    };
}

export function deleteCustomerToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ID_KEY);
    window.dispatchEvent(new Event("storage"));
}
