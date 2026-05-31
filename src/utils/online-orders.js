import { resolveDetalleStatus, resolvePedidoStatus, resolveTipoEntrega } from "./operations";

const ACTIVE_ONLINE_STATUSES = new Set(["PENDIENTE", "CONFIRMADO", "PREPARACION", "LISTO", "EN_ESPERA", "PENDIENTE_ENTREGA", "EN_CAMINO"]);
const DELIVERY_QUEUE_STATUSES = new Set(["PENDIENTE_ENTREGA", "EN_CAMINO"]);

export function isActiveOnlineOrder(pedido) {
    return ACTIVE_ONLINE_STATUSES.has(resolvePedidoStatus(pedido.estado));
}

export function isDeliveryQueueOrder(pedido) {
    return resolveTipoEntrega(pedido.tipoEntrega) === "DOMICILIO"
        && DELIVERY_QUEUE_STATUSES.has(resolvePedidoStatus(pedido.estado));
}

export function formatPedidoItems(pedido) {
    return (pedido.detalles ?? [])
        .filter((detalle) => resolveDetalleStatus(detalle.estado) !== "CANCELADA")
        .map((detalle) => `${detalle.cantidad} x ${detalle.platoNombre || "Plato"}`);
}
