import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDialog } from "../Context/AppDialogContext";
import getToken from "../services/get-token";
import { closeMesa, getMesa } from "../services/mesas";
import useMesaLabels from "../Hooks/useMesaLabels";
import { formatDateTime, formatMoney, orderStateClass, resolveDetalleStatus, resolvePedidoStatus, translateDetalleStatus, translatePedidoStatus } from "../utils/operations";
import "../styles/Staff/operations.css";

export default function MesaDetail() {
    const { id } = useParams();
    const location = useLocation();
    const token = getToken();
    const isAdminView = location.pathname.startsWith("/dashboard");
    const backPath = isAdminView ? "/dashboard/mesas" : "/staff/mesas";

    const [mesa, setMesa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isClosing, setIsClosing] = useState(false);
    const { getMesaShortLabel } = useMesaLabels(Boolean(token?.token));
    const { confirm } = useAppDialog();

    const loadMesa = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getMesa(id, token);
            setMesa(response?.data ?? null);
        } catch (err) {
            setError(err.message || "No se ha podido cargar la mesa.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMesa();
    }, [id]);

    const handleCloseMesa = async () => {
        const confirmed = await confirm({
            title: "Cerrar mesa",
            message: "Se generará una factura con todos los pedidos activos de esta mesa. ¿Continuar?",
            confirmLabel: "Cerrar mesa"
        });
        if (!confirmed) {
            return;
        }

        setIsClosing(true);
        setError("");
        setFeedback("");
        try {
            const response = await closeMesa(id, { descuento: 0, estadoFactura: 0 }, token);
            const facturaId = response?.data?.numeroFactura;
            setFeedback(
                facturaId
                    ? `Mesa cerrada correctamente. Factura generada: ${String(facturaId).slice(0, 8)}`
                    : "Mesa cerrada correctamente."
            );
            await loadMesa();
        } catch (err) {
            setError(err.message || "No se ha podido cerrar la mesa.");
        } finally {
            setIsClosing(false);
        }
    };

    if (loading) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando mesa...</p>
                </div>
            </section>
        );
    }

    if (!mesa) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>No se ha encontrado la mesa solicitada.</p>
                </div>
                <Link to={backPath} className="staff-ops-secondary staff-ops-secondary--link">Volver a mesas</Link>
            </section>
        );
    }

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Mesa activa</p>
                    <h1>{getMesaShortLabel(mesa.idMesa)}</h1>
                    <p>{mesa.ubicacion} · {mesa.capacidad} personas · {mesa.estado ? "Disponible" : "Con servicio"}</p>
                </div>

                <div className="staff-ops-actions">
                    <button type="button" className="staff-ops-primary" onClick={handleCloseMesa} disabled={isClosing || !mesa.tienePedidosActivos}>
                        {isClosing ? "Cerrando..." : "Cerrar mesa"}
                    </button>
                    <Link to={backPath} className="staff-ops-secondary staff-ops-secondary--link">
                        Volver
                    </Link>
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

            <div className="mesa-detail-grid">
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Pedidos activos</span>
                    <strong>{mesa.pedidosAbiertos}</strong>
                </article>
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Pendiente de factura</span>
                    <strong>{formatMoney(mesa.totalPendienteFactura)}</strong>
                </article>
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Estado</span>
                    <strong>{mesa.tienePedidosActivos ? "Con consumo pendiente" : "Sin consumo pendiente"}</strong>
                </article>
            </div>

            <section className="comandas-section">
                <div className="comandas-section__header">
                    <h2>Pedidos de la mesa</h2>
                </div>

                {!mesa.pedidos?.length ? (
                    <div className="staff-ops-empty">
                        <p>No hay pedidos en esta mesa.</p>
                    </div>
                ) : (
                    <div className="comandas-list">
                        {mesa.pedidos.map((pedido) => {
                            const pedidoStatus = resolvePedidoStatus(pedido.estado);
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
                                        <span>{formatDateTime(pedido.fechaModificacion ?? pedido.fechaPedido)}</span>
                                        <Link to={`/staff/pedidos/${pedido.idPedido}`}>
                                            Ver pedido
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>
    );
}
