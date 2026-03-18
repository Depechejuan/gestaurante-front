import { authApiRequest } from "./api-client";

export function getMesas(token) {
    return authApiRequest("/Mesa", { token });
}

export function getMesa(id, token) {
    return authApiRequest(`/Mesa/${id}`, { token });
}

export function createMesa(body, token) {
    return authApiRequest("/Mesa", { method: "POST", body, token });
}

export function updateMesa(id, body, token) {
    return authApiRequest(`/Mesa/${id}`, { method: "PUT", body, token });
}

export function deleteMesa(id, token) {
    return authApiRequest(`/Mesa/${id}`, { method: "DELETE", token });
}
