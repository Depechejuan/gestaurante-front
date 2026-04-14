import { getPublicCatalog } from "./public-catalog";

export default async function getPlatos() {
    const response = await getPublicCatalog();
    return response?.data ?? [];
}
