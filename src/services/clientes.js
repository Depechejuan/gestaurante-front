import { authApiRequest } from "./api-client";

export function getClientes(token, query = "") {
    const suffix = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
    return authApiRequest(`/Cliente${suffix}`, { token });
}

export function getCliente(id, token) {
    return authApiRequest(`/Cliente/${id}`, { token });
}

export function updateCliente(id, payload, token) {
    return authApiRequest(`/Cliente/${id}`, {
        method: "PUT",
        body: payload,
        token
    });
}

export function toggleClienteActivo(id, activo, token) {
    return authApiRequest(`/Cliente/${id}/estado`, {
        method: "PATCH",
        body: { activo },
        token
    });
}
