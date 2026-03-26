import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import getToken from "../services/get-token";
import { getFactura } from "../services/facturas";
import { formatDateTime, formatMoney, orderStateClass, resolveFacturaStatus, translateFacturaStatus } from "../utils/operations";
import "../styles/Staff/operations.css";

export default function UniqueFactura() {
    const { id } = useParams();
    const token = getToken();
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const loadFactura = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getFactura(id, token);
                setFactura(response?.data ?? null);
            } catch (err) {
                setError(err.message || "No se ha podido cargar la factura.");
            } finally {
                setLoading(false);
            }
        };

        loadFactura();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleMockEmail = () => {
        setFeedback("Mock activo: el envio por email aun no esta implementado.");
    };

    if (loading) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando factura...</p>
                </div>
            </section>
        );
    }

    if (!factura) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>No se ha encontrado la factura solicitada.</p>
                </div>
                <Link to="/dashboard/facturas" className="staff-ops-secondary staff-ops-secondary--link">
                    Volver a facturas
                </Link>
            </section>
        );
    }

    const facturaStatus = resolveFacturaStatus(factura.estado);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Factura</p>
                    <h1>Factura {String(factura.numeroFactura).slice(0, 8)}</h1>
                    <p>
                        {factura.idMesa ? `Mesa ${String(factura.idMesa).slice(0, 8)} · ` : ""}
                        {formatDateTime(factura.fechaFactura)}
                    </p>
                </div>

                <div className="staff-ops-actions">
                    <button type="button" className="staff-ops-primary" onClick={handlePrint}>
                        Imprimir
                    </button>
                    <button type="button" className="staff-ops-secondary" onClick={handleMockEmail}>
                        Enviar por email
                    </button>
                </div>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {feedback && (
                <div className="staff-ops-warning">
                    <strong>Mock</strong>
                    <p>{feedback}</p>
                </div>
            )}

            <article className="comanda-card comanda-card--detail">
                <div className="comanda-card__top">
                    <div>
                        <span className={`mesa-detail-card__label ops-badge ${orderStateClass(facturaStatus)}`}>
                            {translateFacturaStatus(facturaStatus)}
                        </span>
                        <h2>{formatMoney(factura.totalConDescuento)}</h2>
                    </div>
                </div>

                <ul>
                    <li>Total bruto: {formatMoney(factura.precioTotal)}</li>
                    <li>Descuento: {formatMoney(factura.descuento)}</li>
                    <li>Pedido principal: {factura.idPedido ? String(factura.idPedido).slice(0, 8) : "No aplica"}</li>
                    <li>Pedidos incluidos: {factura.pedidoIds?.length ? factura.pedidoIds.map((pedidoId) => String(pedidoId).slice(0, 8)).join(", ") : "Sin pedidos listados"}</li>
                </ul>
            </article>

            <Link to="/dashboard/facturas" className="staff-ops-secondary staff-ops-secondary--link">
                Volver a facturas
            </Link>
        </section>
    );
}
