import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import getToken from "../services/get-token";
import { getFacturas } from "../services/facturas";
import { formatDateTime, formatMoney, orderStateClass, resolveFacturaStatus, translateFacturaStatus } from "../utils/operations";
import "../styles/Staff/operations.css";

export default function Facturas() {
    const location = useLocation();
    const token = getToken();
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isStaffContext = location.pathname.startsWith("/staff/");
    const facturaBasePath = isStaffContext ? "/staff/facturas" : "/dashboard/facturas";

    useEffect(() => {
        const loadFacturas = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getFacturas(token);
                setFacturas(response?.data ?? []);
            } catch (err) {
                setError(err.message || "No hemos podido cargar las facturas.");
            } finally {
                setLoading(false);
            }
        };

        loadFacturas();
    }, []);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{isStaffContext ? "Sala" : "Administracion"}</p>
                    <h1>Facturas</h1>
                    <p>
                        Listado real de facturas generadas por pedido o por cierre de mesa,
                        listo para cobro, asignacion fiscal y envío por correo.
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
                    <p>Cargando facturas...</p>
                </div>
            ) : !facturas.length ? (
                <div className="staff-ops-empty">
                    <p>No hay facturas generadas todavia.</p>
                </div>
            ) : (
                <div className="comandas-list">
                    {facturas.map((factura) => {
                        const facturaStatus = resolveFacturaStatus(factura.estado);
                        return (
                            <article key={factura.numeroFactura} className="comanda-card">
                                <div className="comanda-card__top">
                                    <div>
                                        <span className={`mesa-detail-card__label ops-badge ${orderStateClass(facturaStatus)}`}>
                                            {translateFacturaStatus(facturaStatus)}
                                        </span>
                                        <h3>Factura {String(factura.numeroFactura).slice(0, 8)}</h3>
                                    </div>
                                    <strong>{formatMoney(factura.totalConDescuento)}</strong>
                                </div>

                                <p className="ops-inline-meta">
                                    {factura.idMesa ? `Mesa ${String(factura.idMesa).slice(0, 8)} · ` : ""}
                                    {formatDateTime(factura.fechaFactura)}
                                </p>

                                <ul>
                                    <li>Total bruto: {formatMoney(factura.precioTotal)}</li>
                                    <li>Descuento: {formatMoney(factura.descuento)}</li>
                                    <li>Pedidos vinculados: {factura.pedidoIds?.length ?? 0}</li>
                                </ul>

                                <div className="comanda-card__footer">
                                    <span>{factura.idPedido ? `Pedido principal ${String(factura.idPedido).slice(0, 8)}` : "Factura agregada"}</span>
                                    <Link to={`${facturaBasePath}/${factura.numeroFactura}`}>Ver factura</Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
