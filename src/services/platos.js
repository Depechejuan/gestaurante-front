import { authApiRequest } from "./api-client";

export function getAdminPlatos(token) {
    return authApiRequest("/Plato", { token });
}

export function getAdminPlato(id, token) {
    return authApiRequest(`/Plato/${id}`, { token });
}

export function createPlato(body, token) {
    return authApiRequest("/Plato", { method: "POST", body, token });
}

export function updatePlato(id, body, token) {
    return authApiRequest(`/Plato/${id}`, { method: "PUT", body, token });
}

export function deletePlato(id, token) {
    return authApiRequest(`/Plato/${id}`, { method: "DELETE", token });
}
