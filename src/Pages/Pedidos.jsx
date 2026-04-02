import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import useMesaLabels from "../Hooks/useMesaLabels";
import getToken from "../services/get-token";
import { getPedidos } from "../services/pedidos";
import {
    formatDateTime,
    formatMoney,
    orderStateClass,
    resolveCanalPedido,
    resolveDetalleStatus,
    resolvePedidoStatus,
    resolveTipoEntrega,
    translateCanalPedido,
    translateDetalleStatus,
    translateEstadoPago,
    translatePedidoStatus,
    translateTipoEntrega
} from "../utils/operations";
import "../styles/Staff/operations.css";

function isRestaurantOrder(pedido) {
    return resolveTipoEntrega(pedido.tipoEntrega) === "MESA"
        && resolveCanalPedido(pedido.canalPedido) !== "ONLINE";
}

export default function Pedidos() {
    const { roleName } = useAuth();
    const token = getToken();
    const canLoadMesaLabels = Boolean(token?.token) && ["Administrador", "Camarero"].includes(roleName);
    const { getMesaShortLabel } = useMesaLabels(canLoadMesaLabels);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPedidos = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getPedidos(token);
                const restaurantOrders = (response?.data ?? []).filter(isRestaurantOrder);
                setPedidos(restaurantOrders);
            } catch (err) {
                setError(err.message || "No hemos podido cargar los pedidos.");
            } finally {
                setLoading(false);
            }
        };

        loadPedidos();
        const interval = window.setInterval(loadPedidos, 30000);
        return () => window.clearInterval(interval);
    }, []);

    const visiblePedidos = useMemo(() => {
        if (roleName === "Cocinero") {
            return pedidos.filter((pedido) => {
                const status = resolvePedidoStatus(pedido.estado);
                return ["CONFIRMADO", "PREPARACION", "LISTO"].includes(status);
            });
        }

        if (roleName === "Repartidor") {
            return pedidos.filter((pedido) => {
                const status = resolvePedidoStatus(pedido.estado);
                return pedido.tipoEntrega === 2 && ["LISTO", "EN_CAMINO"].includes(status);
            });
        }

        return pedidos;
    }, [pedidos, roleName]);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{roleName === "Cocinero" ? "Cocina" : "Operacion"}</p>
                    <h1>Pedidos</h1>
                    <p>
                        Aqui solo aparecen los pedidos del restaurante servidos en mesa o enviados desde QR.
                        Los pedidos a domicilio o recogida se gestionan en la vista de pedidos online.
                    </p>
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
                    <p>Cargando pedidos...</p>
                </div>
            ) : !visiblePedidos.length ? (
                <div className="staff-ops-empty">
                    <p>No hay pedidos visibles para este rol ahora mismo.</p>
                </div>
            ) : (
                <div className="comandas-list">
                    {visiblePedidos.map((pedido) => {
                        const pedidoStatus = resolvePedidoStatus(pedido.estado);
                        const mesaLabel = pedido.idMesa
                            ? getMesaShortLabel(pedido.idMesa)
                            : pedido.clienteNombre
                                ? pedido.clienteNombre
                                : "Sin mesa";

                        return (
                            <article key={pedido.idPedido} className="comanda-card">
                                <div className="comanda-card__top">
                                    <div>
                                        <span className={`mesa-detail-card__label ops-badge ${orderStateClass(pedidoStatus)}`}>
                                            {translatePedidoStatus(pedidoStatus)}
                                        </span>
                                        <h3>Pedido {String(pedido.idPedido).slice(0, 8)}</h3>
                                    </div>
                                    <strong>{formatMoney(pedido.total)}</strong>
                                </div>

                                <p className="ops-inline-meta">
                                    {mesaLabel} · {translateCanalPedido(pedido.canalPedido)} · {translateTipoEntrega(pedido.tipoEntrega)} · {translateEstadoPago(pedido.estadoPago)}
                                </p>
                                <p className="ops-inline-meta">
                                    {pedido.estaFacturado ? "Facturado" : "Pendiente de factura"} · {formatDateTime(pedido.fechaModificacion ?? pedido.fechaPedido)}
                                </p>

                                <ul>
                                    {pedido.detalles.map((detalle) => {
                                        const detailStatus = resolveDetalleStatus(detalle.estado);
                                        return (
                                            <li key={detalle.idDetallePedido}>
                                                {detalle.cantidad} x {detalle.platoNombre} · {formatMoney(detalle.precioUnitario)} · {translateDetalleStatus(detailStatus)}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="comanda-card__footer">
                                    <span>{pedido.detalles.length} lineas</span>
                                    <Link to={`/staff/pedidos/${pedido.idPedido}`}>Abrir pedido</Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
