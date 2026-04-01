import { authApiRequest } from "./api-client";

export function getClientes(token, query = "") {
    const suffix = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
    return authApiRequest(`/Cliente${suffix}`, { token });
}

export function getCliente(id, token) {
    return authApiRequest(`/Cliente/${id}`, { token });
}
