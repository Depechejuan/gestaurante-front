import { apiRequest } from "./api-client";

export function getPublicCatalog() {
    return apiRequest("/public/catalogo");
}

export function getPublicDish(id) {
    return apiRequest(`/public/catalogo/${id}`);
}
