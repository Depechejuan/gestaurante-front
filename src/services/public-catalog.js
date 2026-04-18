import { apiRequest } from "./api-client";

export function getPublicCatalog() {
    return apiRequest("/public/catalogo");
}

export function getPublicDish(id) {
    return apiRequest(`/public/catalogo/${id}`);
}

export function extractCatalogItems(response) {
    if (Array.isArray(response))
        return response;

    if (Array.isArray(response?.data))
        return response.data;

    if (Array.isArray(response?.items))
        return response.items;

    return [];
}

export async function getPublicCatalogItems() {
    return extractCatalogItems(await getPublicCatalog());
}
