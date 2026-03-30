import { authApiRequest } from "./api-client";

export function getIngredientes(token) {
    return authApiRequest("/Ingrediente", { token });
}

export function createIngrediente(body, token) {
    return authApiRequest("/Ingrediente", { method: "POST", body, token });
}
