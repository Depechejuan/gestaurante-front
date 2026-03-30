import { authApiRequest } from "./api-client";

export function getFacturas(token) {
    return authApiRequest("/Factura", { token });
}

export function getFactura(id, token) {
    return authApiRequest(`/Factura/${id}`, { token });
}

export function createFactura(body, token) {
    return authApiRequest("/Factura", { method: "POST", body, token });
}

export function updateFactura(id, body, token) {
    return authApiRequest(`/Factura/${id}`, { method: "PUT", body, token });
}

export function deleteFactura(id, token) {
    return authApiRequest(`/Factura/${id}`, { method: "DELETE", token });
}

export function searchFacturaClientes(query, token) {
    return authApiRequest(`/Factura/clientes/search?query=${encodeURIComponent(query)}`, { token });
}

export function assignFacturaCliente(id, body, token) {
    return authApiRequest(`/Factura/${id}/cliente`, { method: "PUT", body, token });
}

export function sendFacturaEmail(id, body, token) {
    return authApiRequest(`/Factura/${id}/send-email`, { method: "POST", body, token });
}
