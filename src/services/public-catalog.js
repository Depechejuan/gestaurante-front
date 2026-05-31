import { apiRequest } from "./api-client";
import { repairTextEncoding } from "../utils/text-encoding";

export async function getPublicCatalog() {
    return repairTextEncoding(await apiRequest("/public/catalogo"));
}

export async function getPublicDish(id) {
    return repairTextEncoding(await apiRequest(`/public/catalogo/${id}`));
}

export function extractCatalogItems(response) {
    if (Array.isArray(response))
        return repairTextEncoding(response);

    if (Array.isArray(response?.data))
        return repairTextEncoding(response.data);

    if (Array.isArray(response?.items))
        return repairTextEncoding(response.items);

    return [];
}

export async function getPublicCatalogItems() {
    return extractCatalogItems(await getPublicCatalog());
}
