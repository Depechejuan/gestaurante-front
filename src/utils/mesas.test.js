import { describe, expect, it } from "vitest";
import { compareMesasByPublicOrder } from "./mesas";

describe("mesa ordering", () => {
    it("matches the public numeric URL order used by the backend", () => {
        const mesas = [
            { idMesa: "4", ubicacion: "Interior B1" },
            { idMesa: "1", ubicacion: "Terraza A1" },
            { idMesa: "8", ubicacion: "Salon C1" },
            { idMesa: "2", ubicacion: "Terraza A2" },
            { idMesa: "11", ubicacion: "Reservado D1" }
        ];

        expect([...mesas].sort(compareMesasByPublicOrder).map((mesa) => mesa.ubicacion)).toEqual([
            "Terraza A1",
            "Terraza A2",
            "Interior B1",
            "Salon C1",
            "Reservado D1"
        ]);
    });
});
