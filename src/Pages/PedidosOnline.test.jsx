import { describe, expect, it } from "vitest";
import { translatePedidoStatus } from "../utils/operations";
import { formatPedidoItems, isDeliveryQueueOrder } from "../utils/online-orders";

describe("PedidosOnline helpers", () => {
    it("traduce los nuevos estados de recogida y reparto", () => {
        expect(translatePedidoStatus(7)).toBe("Pendiente de entrega");
        expect(translatePedidoStatus(8)).toBe("En espera");
    });

    it("solo considera accionables los domicilios pendientes de entrega o en camino", () => {
        expect(isDeliveryQueueOrder({ estado: "PENDIENTE_ENTREGA", tipoEntrega: "DOMICILIO" })).toBe(true);
        expect(isDeliveryQueueOrder({ estado: "EN_CAMINO", tipoEntrega: "DOMICILIO" })).toBe(true);
        expect(isDeliveryQueueOrder({ estado: "LISTO", tipoEntrega: "DOMICILIO" })).toBe(false);
        expect(isDeliveryQueueOrder({ estado: "EN_ESPERA", tipoEntrega: "RECOGIDA" })).toBe(false);
    });

    it("prepara la lista de elementos activos para el repartidor", () => {
        const items = formatPedidoItems({
            detalles: [
                { cantidad: 2, platoNombre: "Pizza", estado: "ENTREGADA" },
                { cantidad: 1, platoNombre: "Refresco", estado: "CANCELADA" }
            ]
        });

        expect(items).toEqual(["2 x Pizza"]);
    });
});
