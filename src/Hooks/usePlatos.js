import { useEffect, useState } from "react";
import getPlatos from "../services/get-platos";

export default function usePlatos() {
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPlatos = async () => {
            try {
                setLoading(true);
                const data = await getPlatos();
                if (isMounted) {
                    setPlatos(data);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError("Error cargando platos");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPlatos();

        return () => {
            isMounted = false;
        };
    }, []);

    return { platos, loading, error };
}
