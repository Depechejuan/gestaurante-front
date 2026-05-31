import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./Auth-Context";
import useMesaLabels from "../Hooks/useMesaLabels";
import getToken from "../services/get-token";
import { getPedidos } from "../services/pedidos";
import {
    resolveCanalPedido,
    resolvePedidoStatus,
    resolveTipoEntrega
} from "../utils/operations";

const StaffNotificationsContext = createContext({
    connected: false,
    counts: {
        mesas: 0,
        cocinaSala: 0,
        cocinaOnline: 0,
        onlineRecogida: 0,
        onlineReparto: 0,
        listosSala: 0
    },
    notifications: [],
    dismissNotification: () => {}
});

function normalizeMesaLabel(order, getMesaShortLabel) {
    if (order.idMesa)
        return getMesaShortLabel(order.idMesa);

    return order.clienteNombre || "Pedido sin mesa";
}

function isRestaurantOrder(order) {
    return resolveTipoEntrega(order.tipoEntrega) === "MESA"
        && resolveCanalPedido(order.canalPedido) !== "ONLINE";
}

function isOnlineOrder(order) {
    return resolveCanalPedido(order.canalPedido) === "ONLINE";
}

function isKitchenVisible(order) {
    const status = resolvePedidoStatus(order.estado);
    return ["CONFIRMADO", "PREPARACION", "LISTO"].includes(status);
}

function shouldWatchSala(order) {
    const status = resolvePedidoStatus(order.estado);
    return isRestaurantOrder(order) && ["PENDIENTE", "CONFIRMADO", "PREPARACION", "LISTO"].includes(status);
}

function shouldWatchPickup(order) {
    const status = resolvePedidoStatus(order.estado);
    return resolveCanalPedido(order.canalPedido) === "ONLINE"
        && resolveTipoEntrega(order.tipoEntrega) === "RECOGIDA"
        && ["PENDIENTE", "CONFIRMADO", "PREPARACION", "LISTO", "EN_ESPERA"].includes(status);
}

function shouldWatchDelivery(order) {
    const status = resolvePedidoStatus(order.estado);
    return resolveCanalPedido(order.canalPedido) === "ONLINE"
        && resolveTipoEntrega(order.tipoEntrega) === "DOMICILIO"
        && ["PENDIENTE_ENTREGA", "EN_CAMINO"].includes(status);
}

function buildCounts(orders) {
    const mesas = new Set();

    orders.forEach((order) => {
        if (shouldWatchSala(order) && order.idMesa)
            mesas.add(order.idMesa);
    });

    return {
        mesas: mesas.size,
        cocinaSala: orders.filter((order) => isRestaurantOrder(order) && isKitchenVisible(order)).length,
        cocinaOnline: orders.filter((order) => isOnlineOrder(order) && isKitchenVisible(order)).length,
        onlineRecogida: orders.filter(shouldWatchPickup).length,
        onlineReparto: orders.filter(shouldWatchDelivery).length,
        listosSala: orders.filter((order) => {
            const status = resolvePedidoStatus(order.estado);
            return status === "LISTO" && isRestaurantOrder(order);
        }).length
    };
}

function buildNotification(roleName, previousOrder, nextOrder, getMesaShortLabel) {
    const nextStatus = resolvePedidoStatus(nextOrder.estado);
    const prevStatus = previousOrder ? resolvePedidoStatus(previousOrder.estado) : null;
    const deliveryType = resolveTipoEntrega(nextOrder.tipoEntrega);
    const orderChannel = resolveCanalPedido(nextOrder.canalPedido);
    const mesaLabel = normalizeMesaLabel(nextOrder, getMesaShortLabel);
    const orderLabel = `Pedido ${String(nextOrder.idPedido).slice(0, 8)}`;

    if ((roleName === "Administrador" || roleName === "Camarero") && !previousOrder && ["MESA"].includes(deliveryType))
        return {
            type: "pedido",
            title: "Nuevo pedido de mesa",
            message: `${mesaLabel} acaba de enviar ${orderLabel}.`
        };

    if ((roleName === "Administrador" || roleName === "Cocinero") && nextStatus === "CONFIRMADO" && prevStatus !== "CONFIRMADO")
        return {
            type: "cocina",
            title: "Pedido recibido en cocina",
            message: `${orderLabel} ya está en cola de cocina.`
        };

    if ((roleName === "Administrador" || roleName === "Camarero") && nextStatus === "LISTO" && prevStatus !== "LISTO" && deliveryType === "MESA")
        return {
            type: "listo",
            title: "Pedido listo para servir",
            message: `${orderLabel} está listo en ${mesaLabel}.`
        };

    if ((roleName === "Administrador" || roleName === "Camarero") && nextStatus === "EN_ESPERA" && prevStatus !== "EN_ESPERA" && deliveryType === "RECOGIDA")
        return {
            type: "listo",
            title: "Recogida en espera",
            message: `${orderLabel} está esperando al cliente.`
        };

    if ((roleName === "Administrador" || roleName === "Repartidor") && orderChannel === "ONLINE" && deliveryType === "DOMICILIO" && nextStatus === "PENDIENTE_ENTREGA" && prevStatus !== "PENDIENTE_ENTREGA")
        return {
            type: "reparto",
            title: "Pedido listo para reparto",
            message: `${orderLabel} puede salir a domicilio.`
        };

    if ((roleName === "Administrador" || roleName === "Camarero") && orderChannel === "ONLINE" && !previousOrder)
        return {
            type: "online",
            title: "Nuevo pedido online",
            message: `${orderLabel} ha entrado como ${deliveryType.toLowerCase()}.`
        };

    return null;
}

export function StaffNotificationsProvider({ children }) {
    const { hasToken, roleName } = useAuth();
    const canLoadMesaLabels = hasToken && ["Administrador", "Camarero"].includes(roleName);
    const { getMesaShortLabel } = useMesaLabels(canLoadMesaLabels);
    const [notifications, setNotifications] = useState([]);
    const [counts, setCounts] = useState({
        mesas: 0,
        cocinaSala: 0,
        cocinaOnline: 0,
        onlineRecogida: 0,
        onlineReparto: 0,
        listosSala: 0
    });
    const previousOrdersRef = useRef(null);

    useEffect(() => {
        if (!hasToken || !roleName) {
            previousOrdersRef.current = null;
            setNotifications([]);
            setCounts({
                mesas: 0,
                cocinaSala: 0,
                cocinaOnline: 0,
                onlineRecogida: 0,
                onlineReparto: 0,
                listosSala: 0
            });
            return;
        }

        let cancelled = false;

        const pollOrders = async () => {
            try {
                const token = getToken();
                if (!token?.token)
                    return;

                const response = await getPedidos(token);
                const nextOrders = response?.data ?? [];
                const nextCounts = buildCounts(nextOrders);

                if (cancelled)
                    return;

                setCounts(nextCounts);

                const previousOrders = previousOrdersRef.current;
                if (!previousOrders) {
                    previousOrdersRef.current = nextOrders;
                    return;
                }

                const previousMap = new Map(previousOrders.map((order) => [order.idPedido, order]));
                const freshNotifications = [];

                nextOrders.forEach((order) => {
                    const notification = buildNotification(roleName, previousMap.get(order.idPedido), order, getMesaShortLabel);
                    if (notification) {
                        freshNotifications.push({
                            id: `${order.idPedido}-${resolvePedidoStatus(order.estado)}-${Date.now()}-${freshNotifications.length}`,
                            ...notification
                        });
                    }
                });

                if (freshNotifications.length)
                    setNotifications((current) => [...freshNotifications, ...current].slice(0, 5));

                previousOrdersRef.current = nextOrders;
            } catch {
                // Las vistas ya gestionan sus propios errores; aqui evitamos romper el layout.
            }
        };

        pollOrders();
        const interval = window.setInterval(pollOrders, 20000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [hasToken, roleName, getMesaShortLabel]);

    useEffect(() => {
        if (!notifications.length)
            return;

        const timer = window.setTimeout(() => {
            setNotifications((current) => current.slice(0, -1));
        }, 5000);

        return () => window.clearTimeout(timer);
    }, [notifications]);

    const value = useMemo(() => ({
        connected: hasToken,
        counts,
        notifications,
        dismissNotification: (id) => setNotifications((current) => current.filter((notification) => notification.id !== id))
    }), [counts, hasToken, notifications]);

    return (
        <StaffNotificationsContext.Provider value={value}>
            {children}
        </StaffNotificationsContext.Provider>
    );
}

export function useStaffNotifications() {
    return useContext(StaffNotificationsContext);
}
