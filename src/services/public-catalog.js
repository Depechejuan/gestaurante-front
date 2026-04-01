import { apiRequest } from "./api-client";

export function getPublicCatalog() {
    return apiRequest("/public/catalogo");
}
