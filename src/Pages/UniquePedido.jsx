import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import getToken from "../services/get-token";
import { cancelDetallePedido, cancelPedido, getPedido, updatePedido } from "../services/pedidos";
import {
    formatDateTime,
    formatMoney,
    orderStateClass,
    resolveCanalPedido,
    resolveDetalleStatus,
    resolveEstadoPago,
    resolvePedidoStatus,
    resolveTipoEntrega,
    translateCanalPedido,
    translateDetalleStatus,
    translateEstadoPago,
    translatePedidoStatus,
    translateTipoEntrega
} from "../utils/operations";
import "../styles/Staff/operations.css";

const pedidoTransitions = {
    PENDIENTE: [{ label: "Confirmar pedido", value: 1, roles: ["Administrador", "Camarero"] }],
    CONFIRMADO: [{ label: "Enviar a preparacion", value: 2, roles: ["Administrador", "Cocinero"] }],
    PREPARACION: [{ label: "Marcar listo", value: 3, roles: ["Administrador", "Cocinero"] }],
    LISTO: [
        { label: "Marcar en camino", value: 6, roles: ["Administrador", "Repartidor"], tiposEntrega: ["DOMICILIO"] },
        { label: "Marcar entregado", value: 4, roles: ["Administrador", "Camarero"], tiposEntrega: ["RECOGIDA", "MESA"] }
    ],
    EN_CAMINO: [{ label: "Marcar entregado", value: 4, roles: ["Administrador", "Repartidor"], tiposEntrega: ["DOMICILIO"] }]
};

export default function UniquePedido() {
    const { id } = useParams();
    const { roleName } = useAuth();
    const token = getToken();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [busyAction, setBusyAction] = useState("");

    const loadPedido = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPedido(id, token);
            setPedido(response?.data ?? null);
        } catch (err) {
            setError(err.message || "No se ha podido cargar el pedido.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPedido();
    }, [id]);

    const pedidoStatus = resolvePedidoStatus(pedido?.estado);
    const tipoEntrega = resolveTipoEntrega(pedido?.tipoEntrega);
    const canalPedido = resolveCanalPedido(pedido?.canalPedido);
    const estadoPago = resolveEstadoPago(pedido?.estadoPago);
    const availableTransitions = useMemo(
        () => (pedidoTransitions[pedidoStatus] ?? []).filter((transition) => {
            const allowedRole = transition.roles.includes(roleName);
            const allowedTipo = !transition.tiposEntrega || transition.tiposEntrega.includes(tipoEntrega);
            return allowedRole && allowedTipo;
        }),
        [pedidoStatus, roleName, tipoEntrega]
    );

    const handleTransition = async (nextStatus) => {
        setBusyAction(`status-${nextStatus}`);
        setError("");
        setFeedback("");
        try {
            await updatePedido(id, { estado: nextStatus }, token);
            setFeedback("Estado del pedido actualizado.");
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido actualizar el pedido.");
        } finally {
            setBusyAction("");
        }
    };

    const handleCancelPedido = async () => {
        const confirmed = window.confirm("Se cancelaran todas las lineas activas del pedido. ¿Continuar?");
        if (!confirmed) {
            return;
        }

        setBusyAction("cancel-pedido");
        setError("");
        setFeedback("");
        try {
            await cancelPedido(id, { motivo: "Cancelado desde panel interno" }, token);
            setFeedback("Pedido cancelado correctamente.");
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido cancelar el pedido.");
        } finally {
            setBusyAction("");
        }
    };

    const handleCancelDetalle = async (detalleId) => {
        const confirmed = window.confirm("La linea dejara de contar para la factura. ¿Continuar?");
        if (!confirmed) {
            return;
        }

        setBusyAction(`cancel-line-${detalleId}`);
        setError("");
        setFeedback("");
        try {
            await cancelDetallePedido(id, detalleId, { motivo: "Cancelado desde panel interno" }, token);
            setFeedback("Linea cancelada correctamente.");
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido cancelar la linea.");
        } finally {
            setBusyAction("");
        }
    };

    if (loading) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando pedido...</p>
                </div>
            </section>
        );
    }

    if (!pedido) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>No se ha encontrado el pedido solicitado.</p>
                </div>
                <Link to="/staff/pedidos" className="staff-ops-secondary staff-ops-secondary--link">
                    Volver a pedidos
                </Link>
            </section>
        );
    }

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Detalle de pedido</p>
                    <h1>Pedido {String(pedido.idPedido).slice(0, 8)}</h1>
                    <p>
                        {pedido.idMesa ? `Mesa ${String(pedido.idMesa).slice(0, 8)} · ` : ""}
                        {translatePedidoStatus(pedidoStatus)} · {translateCanalPedido(canalPedido)} · {translateTipoEntrega(tipoEntrega)} · {formatDateTime(pedido.fechaModificacion ?? pedido.fechaPedido)}
                    </p>
                </div>

                <div className="staff-ops-actions">
                    {availableTransitions.map((transition) => (
                        <button
                            key={transition.value}
                            type="button"
                            className="staff-ops-primary"
                            disabled={busyAction === `status-${transition.value}`}
                            onClick={() => handleTransition(transition.value)}
                        >
                            {busyAction === `status-${transition.value}` ? "Actualizando..." : transition.label}
                        </button>
                    ))}

                    {["Administrador", "Camarero"].includes(roleName) && pedidoStatus !== "CANCELADO" && !pedido.estaFacturado && (
                        <button
                            type="button"
                            className="staff-ops-secondary"
                            disabled={busyAction === "cancel-pedido"}
                            onClick={handleCancelPedido}
                        >
                            {busyAction === "cancel-pedido" ? "Cancelando..." : "Cancelar pedido"}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {feedback && (
                <div className="staff-ops-warning staff-ops-warning--success">
                    <strong>Hecho</strong>
                    <p>{feedback}</p>
                </div>
            )}

            <article className="comanda-card comanda-card--detail">
                <div className="comanda-card__top">
                    <div>
                        <span className={`mesa-detail-card__label ops-badge ${orderStateClass(pedidoStatus)}`}>
                            {translatePedidoStatus(pedidoStatus)}
                        </span>
                        <h2>{formatMoney(pedido.total)}</h2>
                    </div>
                    <div className="ops-detail-meta">
                        <span>{pedido.estaFacturado ? "Facturado" : "Pendiente de factura"}</span>
                        <span>{pedido.tieneLineasActivas ? "Con lineas activas" : "Sin lineas activas"}</span>
                        <span>{translateEstadoPago(estadoPago)}</span>
                    </div>
                </div>

                {(canalPedido === "ONLINE" || pedido.clienteNombre || pedido.clienteEmail) && (
                    <div className="mesa-detail-grid">
                        <article className="mesa-detail-card">
                            <span className="mesa-detail-card__label">Cliente</span>
                            <strong>{pedido.clienteNombre || "Cliente online"}</strong>
                            <p>{pedido.clienteEmail || "Sin email"}</p>
                        </article>
                        <article className="mesa-detail-card">
                            <span className="mesa-detail-card__label">Contacto</span>
                            <strong>{pedido.clienteTelefono || "Sin teléfono"}</strong>
                            <p>{translateTipoEntrega(tipoEntrega)}</p>
                        </article>
                        {pedido.clienteDireccionSnapshot && (
                            <article className="mesa-detail-card">
                                <span className="mesa-detail-card__label">Entrega</span>
                                <strong>{pedido.clienteDireccionSnapshot}</strong>
                            </article>
                        )}
                    </div>
                )}

                {pedido.notas && (
                    <div className="staff-ops-warning">
                        <strong>Notas del pedido</strong>
                        <p>{pedido.notas}</p>
                    </div>
                )}

                <div className="ops-lines">
                    {pedido.detalles.map((detalle) => {
                        const detailStatus = resolveDetalleStatus(detalle.estado);
                        const canCancelLine = ["Administrador", "Camarero"].includes(roleName)
                            && detailStatus !== "CANCELADA"
                            && !pedido.estaFacturado
                            && pedidoStatus !== "CANCELADO";

                        return (
                            <article key={detalle.idDetallePedido} className="ops-line-item">
                                <div>
                                    <strong>{detalle.cantidad} x {detalle.platoNombre}</strong>
                                    <p>{formatMoney(detalle.precioUnitario)} por unidad</p>
                                    <p>{detailStatus === "CANCELADA" && detalle.fechaCancelacion ? `Cancelada el ${formatDateTime(detalle.fechaCancelacion)}` : "Linea activa para facturacion"}</p>
                                </div>

                                <div className="ops-line-item__side">
                                    <span className={`mesa-detail-card__label ops-badge ${orderStateClass(detailStatus)}`}>
                                        {translateDetalleStatus(detailStatus)}
                                    </span>
                                    <strong>{formatMoney(detalle.subtotal)}</strong>
                                    {canCancelLine && (
                                        <button
                                            type="button"
                                            className="staff-ops-secondary"
                                            disabled={busyAction === `cancel-line-${detalle.idDetallePedido}`}
                                            onClick={() => handleCancelDetalle(detalle.idDetallePedido)}
                                        >
                                            {busyAction === `cancel-line-${detalle.idDetallePedido}` ? "Cancelando..." : "Cancelar linea"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </article>

            <Link to={pedido.idMesa ? `/staff/mesas/${pedido.idMesa}` : "/staff/pedidos"} className="staff-ops-secondary staff-ops-secondary--link">
                {pedido.idMesa ? "Volver a la mesa" : "Volver a pedidos"}
            </Link>
        </section>
    );
}
