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
