import { useEffect, useMemo, useState } from "react";
import getToken from "../services/get-token";
import { getMesas } from "../services/mesas";

function compareMesas(leftMesa, rightMesa) {
    const leftLocation = String(leftMesa.ubicacion ?? "").localeCompare(String(rightMesa.ubicacion ?? ""), "es", { sensitivity: "base" });
    if (leftLocation !== 0)
        return leftLocation;

    const leftCapacity = Number(leftMesa.capacidad ?? 0) - Number(rightMesa.capacidad ?? 0);
    if (leftCapacity !== 0)
        return leftCapacity;

    return String(leftMesa.idMesa ?? "").localeCompare(String(rightMesa.idMesa ?? ""), "es", { sensitivity: "base" });
}

export default function useMesaLabels(enabled = true) {
    const [mesas, setMesas] = useState([]);

    useEffect(() => {
        if (!enabled) {
            setMesas([]);
            return;
        }

        let cancelled = false;

        const loadMesas = async () => {
            try {
                const token = getToken();
                if (!token?.token)
                    return;

                const response = await getMesas(token);
                if (!cancelled)
                    setMesas(response?.data ?? []);
            } catch {
                if (!cancelled)
                    setMesas([]);
            }
        };

        loadMesas();

        return () => {
            cancelled = true;
        };
    }, [enabled]);

    return useMemo(() => {
        const orderedMesas = [...mesas].sort(compareMesas);
        const labelMap = new Map(
            orderedMesas.map((mesa, index) => [
                mesa.idMesa,
                {
                    shortLabel: `Mesa ${index + 1}`,
                    fullLabel: `Mesa ${index + 1}${mesa.ubicacion ? ` · ${mesa.ubicacion}` : ""}`
                }
            ])
        );

        return {
            orderedMesas,
            getMesaShortLabel: (mesaId) => labelMap.get(mesaId)?.shortLabel ?? (mesaId ? "Mesa asignada" : "Sin mesa"),
            getMesaFullLabel: (mesaId) => labelMap.get(mesaId)?.fullLabel ?? (mesaId ? "Mesa asignada" : "Sin mesa")
        };
    }, [mesas]);
}
