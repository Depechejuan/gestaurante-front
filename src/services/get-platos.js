const host = import.meta.env.VITE_API_HOST;

export default async function getPlatos() {
    try {
        const response = await fetch(`${host}/platos`);
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}