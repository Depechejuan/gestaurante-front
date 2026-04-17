import { getPublicCatalog } from "./public-catalog";

export default async function getPlatos() {
    const response = await getPublicCatalog();

    if (Array.isArray(response))
        return response;

    if (Array.isArray(response?.data))
        return response.data;

    if (Array.isArray(response?.items))
        return response.items;

    return [];
}
