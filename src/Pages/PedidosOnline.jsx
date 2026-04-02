import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import getToken from "../services/get-token";
import { getPedidos } from "../services/pedidos";
import {
    formatDateTime,
    formatMoney,
    orderStateClass,
    resolveCanalPedido,
    resolvePedidoStatus,
    resolveTipoEntrega,
    translateEstadoPago,
    translatePedidoStatus
} from "../utils/operations";
import "../styles/Staff/operations.css";

const viewConfig = {
    todos: {
        label: "Todos",
        title: "Todos los pedidos online",
        empty: "No hay pedidos online activos ahora mismo.",
        roles: ["Administrador", "Camarero", "Cocinero"],
        match: () => true
    },
    recogida: {
        label: "Recogidas",
        title: "Pedidos online para recoger",
        empty: "No hay recogidas activas ahora mismo.",
        roles: ["Administrador", "Camarero", "Cocinero"],
        match: (pedido) => resolveTipoEntrega(pedido.tipoEntrega) === "RECOGIDA"
    },
    reparto: {
        label: "Reparto",
        title: "Pedidos online a domicilio",
        empty: "No hay pedidos de reparto activos ahora mismo.",
        roles: ["Administrador", "Cocinero", "Repartidor"],
        match: (pedido) => resolveTipoEntrega(pedido.tipoEntrega) === "DOMICILIO"
    }
};

function resolveDefaultView(roleName) {
    if (roleName === "Repartidor")
        return "reparto";

    return "todos";
}

export default function PedidosOnline() {
    const { roleName } = useAuth();
    const token = getToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const allowedViews = useMemo(
        () => Object.entries(viewConfig)
            .filter(([, config]) => config.roles.includes(roleName))
            .map(([key]) => key),
        [roleName]
    );

    const requestedView = searchParams.get("view");
    const activeView = allowedViews.includes(requestedView) ? requestedView : allowedViews[0] ?? resolveDefaultView(roleName);
    const activeConfig = viewConfig[activeView] ?? viewConfig.todos;

    useEffect(() => {
        if (searchParams.get("view") === activeView)
            return;

        setSearchParams({ view: activeView }, { replace: true });
    }, [activeView, searchParams, setSearchParams]);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getPedidos(token);
                const nextOrders = (response?.data ?? []).filter((order) => {
                    if (resolveCanalPedido(order.canalPedido) !== "ONLINE")
                        return false;

                    return activeConfig.match(order);
                });

                setOrders(nextOrders);
            } catch (err) {
                setError(err.message || "No se han podido cargar los pedidos online.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
        const interval = window.setInterval(loadOrders, 30000);
        return () => window.clearInterval(interval);
    }, [activeView]);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Pedidos online</p>
                    <h1>{activeConfig.title}</h1>
                    <p>
                        Una sola vista para pedidos online. Cambia entre recogida y reparto
                        segun el rol y el momento operativo.
                    </p>
                </div>
                <div className="staff-ops-actions">
                    {allowedViews.map((viewKey) => (
                        <button
                            key={viewKey}
                            type="button"
                            className={viewKey === activeView ? "staff-ops-primary" : "staff-ops-secondary"}
                            onClick={() => setSearchParams({ view: viewKey })}
                        >
                            {viewConfig[viewKey].label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="staff-ops-empty">
                    <p>Cargando pedidos online...</p>
                </div>
            ) : !orders.length ? (
                <div className="staff-ops-empty">
                    <p>{activeConfig.empty}</p>
                </div>
            ) : (
                <div className="comandas-list">
                    {orders.map((order) => {
                        const status = resolvePedidoStatus(order.estado);
                        const deliveryType = resolveTipoEntrega(order.tipoEntrega);
                        const highlightClass = deliveryType === "DOMICILIO" ? "ops-highlight--delivery" : "ops-highlight--pickup";
                        const highlightText = deliveryType === "DOMICILIO" ? "REPARTO" : "RECOGIDA";

                        return (
                            <article key={order.idPedido} className={`comanda-card ops-highlight-card ${highlightClass}`}>
                                <div className="comanda-card__top">
                                    <div>
                                        <span className="mesa-detail-card__label ops-badge ops-badge--neutral">PEDIDO ONLINE</span>
                                        <h3>{order.clienteNombre || "Cliente online"}</h3>
                                    </div>
                                    <strong>{formatMoney(order.total)}</strong>
                                </div>

                                <p className="ops-inline-meta">
                                    <strong>{highlightText}</strong> · {translatePedidoStatus(status)} · {translateEstadoPago(order.estadoPago)}
                                </p>
                                <p className="ops-inline-meta">
                                    {deliveryType === "DOMICILIO"
                                        ? order.clienteDireccionSnapshot || "Sin dirección"
                                        : order.clienteTelefono || "Sin teléfono"}
                                </p>
                                <p className="ops-inline-meta">{formatDateTime(order.fechaPedido)}</p>

                                <div className="comanda-card__footer">
                                    <span>{order.detalles?.length ?? 0} lineas</span>
                                    <Link to={`/staff/pedidos/${order.idPedido}`}>Abrir pedido</Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
