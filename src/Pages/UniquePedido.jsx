import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import { useAppDialog } from "../Context/AppDialogContext";
import useMesaLabels from "../Hooks/useMesaLabels";
import getToken from "../services/get-token";
import { cancelDetallePedido, cancelPedido, getPedido, updateDetallePedido, updatePedido } from "../services/pedidos";
import { createFactura } from "../services/facturas";
import {
    formatDateTime,
    formatMoney,
    isPedidoReadyForFactura,
    normalizeDeliveryAddress,
    orderStateClass,
    resolveCanalPedido,
    resolveDetalleStatus,
    resolvePedidoFacturaLabel,
    resolveEstadoPago,
    resolvePedidoStatus,
    sortPedidoDetalles,
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

const detalleTransitions = {
    ACTIVA: [
        { label: "Confirmar linea", value: 4, roles: ["Administrador", "Camarero"] },
        { label: "Enviar a cocina", value: 2, roles: ["Administrador", "Camarero"] }
    ],
    EN_COCINA: [
        { label: "Marcar preparado", value: 3, roles: ["Administrador", "Cocinero"] }
    ],
    PREPARADO: [
        { label: "Confirmar entrega", value: 4, roles: ["Administrador", "Camarero"] }
    ]
};

export default function UniquePedido() {
    const { id } = useParams();
    const { roleName } = useAuth();
    const token = getToken();
    const { getMesaShortLabel } = useMesaLabels(Boolean(token?.token));
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [busyAction, setBusyAction] = useState("");
    const [selectedLineIds, setSelectedLineIds] = useState([]);
    const { confirm, prompt } = useAppDialog();

    const loadPedido = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPedido(id, token);
            setPedido(response?.data ?? null);
            setSelectedLineIds([]);
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
    const canGenerateFactura = ["Administrador", "Camarero"].includes(roleName)
        && canalPedido !== "ONLINE"
        && !pedido?.estaFacturado
        && isPedidoReadyForFactura(pedido);
    const isRepartidorDeliveryOrder = roleName === "Repartidor"
        && canalPedido === "ONLINE"
        && tipoEntrega === "DOMICILIO";
    const canCancelPedido = (["Administrador", "Camarero"].includes(roleName)
        && pedidoStatus !== "CANCELADO"
        && !pedido?.estaFacturado)
        || (isRepartidorDeliveryOrder && ["LISTO", "EN_CAMINO"].includes(pedidoStatus));
    const backPath = isRepartidorDeliveryOrder
        ? "/staff/online?view=reparto"
        : pedido?.idMesa ? `/staff/mesas/${pedido.idMesa}` : "/staff/pedidos";
    const availableTransitions = useMemo(
        () => (pedidoTransitions[pedidoStatus] ?? []).filter((transition) => {
            const allowedRole = transition.roles.includes(roleName);
            const allowedTipo = !transition.tiposEntrega || transition.tiposEntrega.includes(tipoEntrega);
            return allowedRole && allowedTipo;
        }),
        [pedidoStatus, roleName, tipoEntrega]
    );
    const detalleActionMap = useMemo(() => {
        const detalles = pedido?.detalles ?? [];

        return detalles.reduce((acc, detalle) => {
            const detailStatus = resolveDetalleStatus(detalle.estado);
            const availableDetalleTransitions = (detalleTransitions[detailStatus] ?? []).filter((transition) => transition.roles.includes(roleName));
            const canSelect = availableDetalleTransitions.length > 0;

            acc[detalle.idDetallePedido] = {
                detailStatus,
                availableDetalleTransitions,
                canSelect
            };

            return acc;
        }, {});
    }, [pedido?.detalles, roleName]);
    const selectableLineIds = useMemo(
        () => Object.entries(detalleActionMap)
            .filter(([, config]) => config.canSelect)
            .map(([detalleId]) => detalleId),
        [detalleActionMap]
    );
    const selectedCount = selectedLineIds.length;
    const canSelectAll = selectableLineIds.length > 0 && selectedLineIds.length < selectableLineIds.length;
    const selectedTransitions = useMemo(() => {
        const transitions = new Map();

        selectedLineIds.forEach((detalleId) => {
            const config = detalleActionMap[detalleId];
            if (!config)
                return;

            config.availableDetalleTransitions.forEach((transition) => {
                const existing = transitions.get(transition.value) ?? { ...transition, count: 0 };
                existing.count += 1;
                transitions.set(transition.value, existing);
            });
        });

        return Array.from(transitions.values());
    }, [detalleActionMap, selectedLineIds]);

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
        let motivo = "Cancelado desde panel interno";
        if (isRepartidorDeliveryOrder) {
            const promptValue = await prompt({
                title: "Cancelar reparto",
                message: "Indica el motivo por el que el pedido no puede entregarse.",
                inputLabel: "Motivo de cancelación",
                placeholder: "Ej. cliente ausente, dirección incorrecta...",
                confirmLabel: "Cancelar pedido"
            });
            if (promptValue === false)
                return;

            if (!String(promptValue ?? "").trim()) {
                setError("Debes indicar un motivo para cancelar el reparto.");
                return;
            }

            motivo = String(promptValue).trim();
        } else {
            const confirmed = await confirm({
                title: "Cancelar pedido",
                message: "Se cancelarán todas las líneas activas del pedido. ¿Continuar?",
                confirmLabel: "Cancelar pedido"
            });
            if (!confirmed)
                return;
        }

        setBusyAction("cancel-pedido");
        setError("");
        setFeedback("");
        try {
            await cancelPedido(id, { motivo }, token);
            setFeedback("Pedido cancelado correctamente.");
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido cancelar el pedido.");
        } finally {
            setBusyAction("");
        }
    };

    const handleCancelDetalle = async (detalleId) => {
        const confirmed = await confirm({
            title: "Cancelar línea",
            message: "La línea dejará de contar para la factura. ¿Continuar?",
            confirmLabel: "Cancelar línea"
        });
        if (!confirmed)
            return;

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

    const handleDetalleTransition = async (detalleId, nextStatus) => {
        setBusyAction(`status-line-${detalleId}-${nextStatus}`);
        setError("");
        setFeedback("");
        try {
            await updateDetallePedido(id, detalleId, { estado: nextStatus }, token);
            setFeedback("Estado de la línea actualizado.");
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido actualizar la línea.");
        } finally {
            setBusyAction("");
        }
    };

    const toggleLineSelection = (detalleId) => {
        setSelectedLineIds((current) => (
            current.includes(detalleId)
                ? current.filter((idValue) => idValue !== detalleId)
                : [...current, detalleId]
        ));
    };

    const toggleSelectAllLines = () => {
        setSelectedLineIds((current) => (
            current.length === selectableLineIds.length ? [] : selectableLineIds
        ));
    };

    const handleBatchDetalleTransition = async (nextStatus, label) => {
        const eligibleLineIds = selectedLineIds.filter((detalleId) =>
            (detalleActionMap[detalleId]?.availableDetalleTransitions ?? []).some((transition) => transition.value === nextStatus)
        );

        if (!eligibleLineIds.length) {
            setError("No hay líneas seleccionadas compatibles con esa acción.");
            return;
        }

        setBusyAction(`batch-${nextStatus}`);
        setError("");
        setFeedback("");

        try {
            for (const detalleId of eligibleLineIds) {
                await updateDetallePedido(id, detalleId, { estado: nextStatus }, token);
            }

            setFeedback(`${label}: ${eligibleLineIds.length} línea(s) actualizada(s).`);
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido actualizar la selección.");
        } finally {
            setBusyAction("");
        }
    };

    const handleGenerateFactura = async () => {
        setBusyAction("generar-factura");
        setError("");
        setFeedback("");
        try {
            const response = await createFactura({ idPedido: pedido.idPedido, estado: 0, descuento: 0 }, token);
            const facturaId = response?.data?.numeroFactura;
            setFeedback(
                facturaId
                    ? `Factura generada correctamente: ${String(facturaId).slice(0, 8)}.`
                    : "Factura generada correctamente."
            );
            await loadPedido();
        } catch (err) {
            setError(err.message || "No se ha podido generar la factura del pedido.");
        } finally {
            setBusyAction("");
        }
    };

    if (loading)
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando pedido...</p>
                </div>
            </section>
        );

    if (!pedido)
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

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Detalle de pedido</p>
                    <h1>Pedido {String(pedido.idPedido).slice(0, 8)}</h1>
                    <p>
                        {pedido.idMesa ? `${getMesaShortLabel(pedido.idMesa)} · ` : ""}
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

                    {canCancelPedido && (
                        <button
                            type="button"
                            className="staff-ops-secondary"
                            disabled={busyAction === "cancel-pedido"}
                            onClick={handleCancelPedido}
                        >
                            {busyAction === "cancel-pedido" ? "Cancelando..." : isRepartidorDeliveryOrder ? "Cancelar reparto" : "Cancelar pedido"}
                        </button>
                    )}

                    {canGenerateFactura && (
                        <button
                            type="button"
                            className="staff-ops-secondary"
                            disabled={busyAction === "generar-factura"}
                            onClick={handleGenerateFactura}
                        >
                            {busyAction === "generar-factura" ? "Generando..." : "Generar factura"}
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
                        <span>{resolvePedidoFacturaLabel(pedido)}</span>
                        <span>{isPedidoReadyForFactura(pedido) ? "Todo entregado" : "Servicio en curso"}</span>
                        <span>{translateEstadoPago(estadoPago)}</span>
                    </div>
                </div>

                {(canalPedido === "ONLINE" || pedido.clienteNombre || pedido.clienteEmail) && (
                    <div className="mesa-detail-grid">
                        <article className="mesa-detail-card">
                            <span className="mesa-detail-card__label">Cliente</span>
                            <strong>{pedido.clienteNombre || "Cliente online"}</strong>
                            {!isRepartidorDeliveryOrder && <p>{pedido.clienteEmail || "Sin email"}</p>}
                        </article>
                        <article className="mesa-detail-card">
                            <span className="mesa-detail-card__label">Contacto</span>
                            <strong>{pedido.clienteTelefono || "Sin teléfono"}</strong>
                            {!isRepartidorDeliveryOrder && <p>{translateTipoEntrega(tipoEntrega)}</p>}
                        </article>
                        {pedido.clienteDireccionSnapshot && (
                            <article className="mesa-detail-card">
                                <span className="mesa-detail-card__label">Entrega</span>
                                <strong>{isRepartidorDeliveryOrder ? normalizeDeliveryAddress(pedido.clienteDireccionSnapshot) : pedido.clienteDireccionSnapshot}</strong>
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

                {selectableLineIds.length > 0 && (
                    <div className="ops-lines-toolbar">
                        <div className="ops-lines-toolbar__selection">
                            <label className="ops-lines-toolbar__check">
                                <input
                                    type="checkbox"
                                    checked={selectedLineIds.length > 0 && selectedLineIds.length === selectableLineIds.length}
                                    onChange={toggleSelectAllLines}
                                />
                                <span>{canSelectAll ? "Seleccionar líneas accionables" : "Quitar selección"}</span>
                            </label>
                            <span>{selectedCount ? `${selectedCount} seleccionada(s)` : "Selecciona una o varias líneas"}</span>
                        </div>

                        {selectedTransitions.length > 0 && (
                            <div className="ops-lines-toolbar__actions">
                                {selectedTransitions.map((transition) => (
                                    <button
                                        key={`batch-${transition.value}`}
                                        type="button"
                                        className={transition.value === 2 ? "staff-ops-secondary" : "staff-ops-primary"}
                                        disabled={busyAction === `batch-${transition.value}`}
                                        onClick={() => handleBatchDetalleTransition(transition.value, transition.label)}
                                    >
                                        {busyAction === `batch-${transition.value}`
                                            ? "Actualizando..."
                                            : `${transition.label} (${transition.count})`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="ops-lines">
                    {sortPedidoDetalles(pedido.detalles).map((detalle) => {
                        const detailConfig = detalleActionMap[detalle.idDetallePedido] ?? {
                            detailStatus: resolveDetalleStatus(detalle.estado),
                            availableDetalleTransitions: [],
                            canSelect: false
                        };
                        const detailStatus = detailConfig.detailStatus;
                        const canCancelLine = ["Administrador", "Camarero"].includes(roleName)
                            && detailStatus !== "CANCELADA"
                            && detailStatus !== "ENTREGADA"
                            && !pedido.estaFacturado
                            && pedidoStatus !== "CANCELADO";
                        const availableDetalleTransitions = detailConfig.availableDetalleTransitions;

                        return (
                            <article key={detalle.idDetallePedido} className="ops-line-item">
                                <div className="ops-line-item__main">
                                    {detailConfig.canSelect && (
                                        <label className="ops-line-item__check">
                                            <input
                                                type="checkbox"
                                                checked={selectedLineIds.includes(detalle.idDetallePedido)}
                                                onChange={() => toggleLineSelection(detalle.idDetallePedido)}
                                            />
                                        </label>
                                    )}
                                    <strong>{detalle.cantidad} x {detalle.platoNombre}</strong>
                                    <p>{formatMoney(detalle.precioUnitario)} por unidad</p>
                                    <p>
                                        {detailStatus === "CANCELADA" && detalle.fechaCancelacion
                                            ? `Cancelada el ${formatDateTime(detalle.fechaCancelacion)}`
                                            : detailStatus === "ACTIVA"
                                                ? "Pendiente de servir o enviar a cocina"
                                                : detailStatus === "EN_COCINA"
                                                    ? "Preparándose en cocina"
                                                    : detailStatus === "PREPARADO"
                                                        ? "Lista para entregar"
                                                        : "Entregada al cliente"}
                                    </p>
                                </div>

                                <div className="ops-line-item__side">
                                    <span className={`mesa-detail-card__label ops-badge ${orderStateClass(detailStatus)}`}>
                                        {translateDetalleStatus(detailStatus)}
                                    </span>
                                    <strong>{formatMoney(detalle.subtotal)}</strong>
                                    {availableDetalleTransitions.length > 0 && (
                                        <div className="ops-line-item__actions">
                                            {availableDetalleTransitions.map((transition) => (
                                                <button
                                                    key={`${detalle.idDetallePedido}-${transition.value}`}
                                                    type="button"
                                                    className={transition.value === 2 ? "staff-ops-secondary" : "staff-ops-primary"}
                                                    disabled={busyAction === `status-line-${detalle.idDetallePedido}-${transition.value}`}
                                                    onClick={() => handleDetalleTransition(detalle.idDetallePedido, transition.value)}
                                                >
                                                    {busyAction === `status-line-${detalle.idDetallePedido}-${transition.value}` ? "Actualizando..." : transition.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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

            <Link to={backPath} className="staff-ops-secondary staff-ops-secondary--link">
                {isRepartidorDeliveryOrder ? "Volver a pedidos online" : pedido.idMesa ? "Volver a la mesa" : "Volver a pedidos"}
            </Link>
        </section>
    );
}
