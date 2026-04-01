import { getPublicCatalog } from "./public-catalog";
import { getMockPlatos } from "./platos-adapter";

export default async function getPlatos() {
    try {
        const response = await getPublicCatalog();
        return response?.data ?? [];
    } catch (err) {
        const allowMockFallback = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_PUBLIC_CATALOG === "true";
        if (allowMockFallback)
            return await getMockPlatos();

        throw err;
    }
}
