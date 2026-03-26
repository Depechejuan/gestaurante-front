import { apiRequest } from "./api-client";

export function openPublicMesaSession(idMesa, sessionToken) {
    return apiRequest(`/public/mesa/${idMesa}/session`, {
        method: "POST",
        body: {
            sessionToken: sessionToken || null
        }
    });
}

export function getPublicMesaPedidos(idMesa, sessionToken) {
    return apiRequest(`/public/mesa/${idMesa}/pedidos`, {
        headers: {
            "X-Mesa-Session": sessionToken
        }
    });
}

export function createPublicMesaPedido(idMesa, sessionToken, body) {
    return apiRequest(`/public/mesa/${idMesa}/pedido`, {
        method: "POST",
        headers: {
            "X-Mesa-Session": sessionToken
        },
        body
    });
}
