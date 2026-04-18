import { useEffect, useState } from "react";
import { getPublicCatalogItems } from "../services/public-catalog";

export default function usePlatos() {
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPlatos = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPublicCatalogItems();
                if (isMounted)
                    setPlatos(data);
            } catch (err) {
                if (isMounted)
                    setError(err?.message || "No se ha podido cargar la carta.");
            } finally {
                if (isMounted)
                    setLoading(false);
            }
        };

        fetchPlatos();

        return () => {
            isMounted = false;
        };
    }, []);

    return { platos, loading, error };
}
