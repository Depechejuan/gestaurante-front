import { getPublicCatalog } from "./public-catalog";
import { getMockPlatos } from "./platos-adapter";

export default async function getPlatos() {
    try {
        const response = await getPublicCatalog();
        return response?.data ?? [];
    } catch (err) {
        console.error(err);
        return await getMockPlatos();
    }
}
