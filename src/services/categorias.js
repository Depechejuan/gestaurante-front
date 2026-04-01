import { authApiRequest } from "./api-client";

export function getCategorias(token) {
    return authApiRequest("/Categoria", { token });
}

export function createCategoria(body, token) {
    return authApiRequest("/Categoria", { method: "POST", body, token });
}
