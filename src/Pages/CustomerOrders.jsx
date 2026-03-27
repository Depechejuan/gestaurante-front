import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { getCustomerOrders } from "../services/customer-account";
import {
    formatDateTime,
    formatMoney,
    orderStateClass,
    resolvePedidoStatus,
    translateEstadoPago,
    translatePedidoStatus,
    translateTipoEntrega
} from "../utils/operations";

export default function CustomerOrders() {
    const { token } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getCustomerOrders(token.token);
                setOrders(response?.data ?? []);
            } catch (err) {
                setError(err.message || "No se han podido cargar tus pedidos.");
            }
        };
        load();
    }, [token?.token]);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Cuenta cliente</p>
                    <h1>Mis pedidos</h1>
                </div>
            </div>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {!orders.length ? (
                <div className="staff-ops-empty"><p>Aún no tienes pedidos online.</p></div>
            ) : (
                <div className="comandas-list">
                    {orders.map((order) => (
                        <article key={order.idPedido} className="comanda-card">
                            <div className="comanda-card__top">
                                <div>
                                    <span className={`mesa-detail-card__label ops-badge ${orderStateClass(resolvePedidoStatus(order.estado))}`}>
                                        {translatePedidoStatus(order.estado)}
                                    </span>
                                    <h3>Pedido {String(order.idPedido).slice(0, 8)}</h3>
                                </div>
                                <strong>{formatMoney(order.total)}</strong>
                            </div>
                            <p>{translateTipoEntrega(order.tipoEntrega)} · {translateEstadoPago(order.estadoPago)} · {formatDateTime(order.fechaPedido)}</p>
                            {order.detalles?.length ? <p>{order.detalles.length} lineas · {order.detalles.map((detail) => detail.platoNombre).join(", ")}</p> : null}
                            <Link to="/pedido-online">Repetir pedido</Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
