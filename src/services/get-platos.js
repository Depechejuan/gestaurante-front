import { getMockPlatos } from "./platos-adapter";

export default async function getPlatos() {
    try {
        return await getMockPlatos();
    } catch (err) {
        console.error(err);
        return null;
    }
}
