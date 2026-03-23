import { authApiRequest } from "./api-client";

export function getPedidos(token) {
    return authApiRequest("/Pedido", { token });
}

export function getPedido(id, token) {
    return authApiRequest(`/Pedido/${id}`, { token });
}

export function createPedido(body, token) {
    return authApiRequest("/Pedido", { method: "POST", body, token });
}

export function updatePedido(id, body, token) {
    return authApiRequest(`/Pedido/${id}`, { method: "PUT", body, token });
}

export function deletePedido(id, token) {
    return authApiRequest(`/Pedido/${id}`, { method: "DELETE", token });
}

export function getDetallePedido(pedidoId, detalleId, token) {
    return authApiRequest(`/Pedido/${pedidoId}/linea/${detalleId}`, { token });
}

export function createDetallePedido(pedidoId, body, token) {
    return authApiRequest(`/Pedido/${pedidoId}/linea`, { method: "POST", body, token });
}

export function updateDetallePedido(pedidoId, detalleId, body, token) {
    return authApiRequest(`/Pedido/${pedidoId}/linea/${detalleId}`, { method: "PUT", body, token });
}

export function deleteDetallePedido(pedidoId, detalleId, token) {
    return authApiRequest(`/Pedido/${pedidoId}/linea/${detalleId}`, { method: "DELETE", token });
}
