import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { getCustomerOrders } from "../services/customer-account";
import { getPublicCatalog } from "../services/public-catalog";
import { addManyOnlineCartItems } from "../services/online-order-storage";
import { decorateCatalogItems } from "../utils/catalog";
import {
    formatDateTime,
    formatMoney,
    orderStateClass,
    resolvePedidoStatus,
    translateEstadoPago,
    translatePedidoStatus,
    translateTipoEntrega
} from "../utils/operations";
import "../styles/Customer/form.css";

export default function CustomerOrders() {
    const navigate = useNavigate();
    const { token } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");

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

    const handleRepeatOrder = async (order) => {
        setError("");
        setFeedback("");

        try {
            const catalogResponse = await getPublicCatalog();
            const catalog = decorateCatalogItems(catalogResponse?.data ?? []);
            const catalogById = new Map(catalog.map((item) => [String(item.idPlato ?? item.id), item]));
            const itemsToRepeat = [];
            const skippedItems = [];

            (order.detalles ?? []).forEach((detail) => {
                const currentDish = catalogById.get(String(detail.idPlato));
                if (!currentDish) {
                    skippedItems.push(detail.platoNombre);
                    return;
                }

                itemsToRepeat.push({
                    id: currentDish.idPlato ?? currentDish.id,
                    backendId: currentDish.idPlato ?? currentDish.id,
                    nombre: currentDish.nombre,
                    quantity: detail.cantidad,
                    unitPrice: Number(currentDish.precio ?? detail.precioUnitario ?? 0),
                    tipoVisible: currentDish.tipoVisible
                });
            });

            if (!itemsToRepeat.length) {
                setError("No hemos podido recuperar ninguna línea válida de ese pedido.");
                return;
            }

            addManyOnlineCartItems(itemsToRepeat);
            navigate("/pedido-online", {
                state: {
                    cartMessage: skippedItems.length
                        ? `Hemos añadido ${itemsToRepeat.length} líneas al carrito. No pudimos recuperar: ${skippedItems.join(", ")}.`
                        : `Hemos añadido ${itemsToRepeat.length} líneas de tu pedido al carrito.`
                }
            });
        } catch (err) {
            setError(err.message || "No se ha podido repetir el pedido.");
        }
    };

    return (
        <section className="public-page public-page--menu customer-orders-page">
            <section className="menu-public__hero">
                <div>
                    <p className="public-eyebrow">Cuenta cliente</p>
                    <h1>Mis pedidos</h1>
                    <p>Consulta tu historial y repite en segundos los pedidos que más haces.</p>
                </div>
            </section>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}
            {!orders.length ? (
                <div className="staff-ops-empty"><p>Aún no tienes pedidos online.</p></div>
            ) : (
                <div className="customer-orders-list">
                    {orders.map((order) => (
                        <article key={order.idPedido} className="customer-order-card">
                            <div className="customer-order-card__top">
                                <div>
                                    <span className={`mesa-detail-card__label ops-badge ${orderStateClass(resolvePedidoStatus(order.estado))}`}>
                                        {translatePedidoStatus(order.estado)}
                                    </span>
                                    <h3>Pedido {String(order.idPedido).slice(0, 8)}</h3>
                                </div>
                                <strong>{formatMoney(order.total)}</strong>
                            </div>
                            <div className="customer-order-card__meta">
                                <span>{translateTipoEntrega(order.tipoEntrega)}</span>
                                <span>{translateEstadoPago(order.estadoPago)}</span>
                                <span>{formatDateTime(order.fechaPedido)}</span>
                            </div>
                            {order.detalles?.length ? (
                                <div className="customer-order-card__items">
                                    <p>{order.detalles.length} líneas</p>
                                    <ul>
                                        {order.detalles.map((detail) => (
                                            <li key={detail.idDetallePedido}>
                                                {detail.cantidad} x {detail.platoNombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                            <div className="menu-public__cta-row">
                                <button type="button" className="customer-btn-primary customer-btn-primary--inline" onClick={() => handleRepeatOrder(order)}>
                                    Repetir pedido
                                </button>
                                <Link to="/pedido-online" className="customer-btn-secondary customer-btn-secondary--inline">
                                    Ver carta
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
