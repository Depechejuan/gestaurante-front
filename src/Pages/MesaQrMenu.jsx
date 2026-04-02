import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ListPlatosPublic from "../Components/ListPlatosPublic";
import usePlatos from "../Hooks/usePlatos";
import { createPublicMesaPedido, getPublicMesaPedidos, openPublicMesaSession } from "../services/public-mesa";
import {
    addItemToTableCart,
    clearTableCart,
    clearTablePublicSession,
    getCurrentTableCartSnapshot,
    removeItemFromTableCart,
    saveTablePublicSession,
    startTableSession,
    updateTableCartItemQuantity
} from "../services/table-order-storage";
import { formatDateTime, formatMoney, resolvePedidoStatus, translatePedidoStatus } from "../utils/operations";
import { decorateCatalogItems } from "../utils/catalog";
import "../styles/Customer/platos.css";

function isGuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value ?? ""));
}

export default function MesaQrMenu() {
    const { id } = useParams();
    const { platos, loading, error } = usePlatos();
    const [tableState, setTableState] = useState(() => startTableSession(id));
    const [cartFeedback, setCartFeedback] = useState("");
    const [sending, setSending] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [sessionError, setSessionError] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [publicOrders, setPublicOrders] = useState([]);
    const [resolvedMesaId, setResolvedMesaId] = useState("");

    const loadPublicOrders = async (mesaId, sessionToken) => {
        try {
            const response = await getPublicMesaPedidos(mesaId, sessionToken);
            setPublicOrders(response?.data ?? []);
        } catch {
            setPublicOrders([]);
        }
    };

    useEffect(() => {
        const bootstrapSession = async () => {
            const initialState = startTableSession(id);
            setTableState(initialState);
            setSessionLoading(true);
            setSessionError("");
            setIsLocked(false);
            setPublicOrders([]);
            setCartFeedback("");

            try {
                const response = await openPublicMesaSession(id, initialState.sessionToken);
                const session = response?.data;
                if (!session?.sessionToken)
                    throw new Error("No se ha podido abrir la sesión de mesa.");

                setResolvedMesaId(session.idMesa ?? "");
                const nextState = saveTablePublicSession(id, session.sessionToken, session.expiresAt);
                setTableState(nextState);
                await loadPublicOrders(id, session.sessionToken);
            } catch (err) {
                if (err.status === 409) {
                    setIsLocked(true);
                    setSessionError(err.message || "Esta mesa ya está siendo usada por otro cliente.");
                    clearTablePublicSession(id);
                    setTableState(startTableSession(id));
                } else if (err.status === 401) {
                    setSessionError("La sesión de mesa ha expirado. Vuelve a escanear el QR.");
                    clearTablePublicSession(id);
                    setTableState(startTableSession(id));
                } else {
                    setSessionError(err.message || "No se ha podido abrir la sesión pública de esta mesa.");
                }
            } finally {
                setSessionLoading(false);
            }
        };

        bootstrapSession();
    }, [id]);

    const platosConTipo = useMemo(() => decorateCatalogItems(platos ?? []), [platos]);

    const cartTotal = useMemo(
        () => tableState.cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
        [tableState.cart]
    );

    const handleAddToCart = (plato, amount) => {
        if (isLocked || !tableState.sessionToken)
            return;

        const numericPrice = Number.parseFloat(String(plato.precio).replace(",", ".").replace(" EUR", ""));
        const unitPrice = Number.isNaN(numericPrice) ? 0 : numericPrice;
        const nextState = addItemToTableCart(id, {
            id: String(plato.idPlato ?? plato.id),
            backendId: plato.idPlato ?? plato.id ?? null,
            nombre: plato.nombre,
            quantity: amount,
            unitPrice,
            tipoVisible: plato.tipoVisible
        });
        setTableState(nextState);
        setCartFeedback(`${amount} x ${plato.nombre} añadido a tu carrito.`);
    };

    const handleQuantityChange = (itemId, quantity) => {
        setTableState(updateTableCartItemQuantity(id, itemId, quantity));
    };

    const handleRemove = (itemId) => {
        setTableState(removeItemFromTableCart(id, itemId));
    };

    const handleSubmitOrder = async () => {
        setSending(true);
        const cartSnapshot = getCurrentTableCartSnapshot(id);
        if (!cartSnapshot.items.length) {
            setCartFeedback("El carrito esta vacio.");
            setSending(false);
            return;
        }

        const canSend = tableState.sessionToken
            && cartSnapshot.items.every((item) => isGuid(item.backendId));

        if (!canSend) {
            setCartFeedback(
                "El carrito queda guardado en este dispositivo, pero no todos los platos de la carta tienen un identificador valido para enviarse al backend."
            );
            setSending(false);
            return;
        }

        try {
            const response = await createPublicMesaPedido(id, tableState.sessionToken, {
                detalles: cartSnapshot.items.map((item) => ({
                    idPlato: item.backendId,
                    cantidad: item.quantity
                }))
            });

            const nextState = clearTableCart(id);
            setTableState(nextState);
            await loadPublicOrders(id, tableState.sessionToken);
            setCartFeedback(
                response?.data?.idPedido
                    ? `Pedido enviado correctamente. Referencia ${String(response.data.idPedido).slice(0, 8)}.`
                    : "Pedido enviado correctamente."
            );
        } catch (err) {
            if (err.status === 401) {
                setSessionError("La sesión de mesa ha expirado. Vuelve a escanear el QR para seguir.");
                clearTablePublicSession(id);
            } else {
                setCartFeedback(err.message || "No hemos podido enviar el pedido. Tu carrito sigue guardado en local.");
            }
        } finally {
            setSending(false);
        }
    };

    if (loading || sessionLoading)
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Mesa {id}</p>
                    <h1>Preparando tu sesion</h1>
                    <p>Estamos cargando la carta y validando el acceso de esta mesa.</p>
                </div>
            </section>
        );

    if (error)
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Mesa {id}</p>
                    <h1>No hemos podido cargar la carta</h1>
                    <p>{error}</p>
                </div>
            </section>
        );

    if (isLocked)
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Mesa {id}</p>
                    <h1>Mesa ocupada</h1>
                    <p>{sessionError || "Esta mesa ya está siendo usada por el cliente que inició la sesión."}</p>
                </div>
            </section>
        );

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero menu-public__hero--mesa">
                <div>
                    <p className="public-eyebrow">Pedido desde QR</p>
                    <h1>Mesa {id}</h1>
                    <p>
                        Esta mesa queda vinculada temporalmente a este dispositivo. El carrito vive en local
                        y solo se borra cuando el backend acepta el pedido.
                    </p>
                    {sessionError && <p className="menu-public__feedback">{sessionError}</p>}
                </div>
                <div className="mesa-session-card">
                    <span>Sesion activa</span>
                    <strong>{resolvedMesaId ? `Mesa ${id}` : tableState.mesaId}</strong>
                    <small>
                        Caduca {tableState.sessionExpiresAt ? formatDateTime(tableState.sessionExpiresAt) : "en 4 horas"}
                    </small>
                </div>
            </section>

            <section className="mesa-order-shell">
                <div className="mesa-order-main">
                    {cartFeedback && <p className="menu-public__feedback">{cartFeedback}</p>}
                    <ListPlatosPublic platos={platosConTipo} onAddToCart={handleAddToCart} />
                </div>

                <aside className="mesa-order-sidebar">
                    <section className="mesa-order-card mesa-order-card--cart">
                        <div className="mesa-order-card__header">
                            <div>
                                <p className="public-eyebrow">Carrito</p>
                                <h2>Pedido actual</h2>
                            </div>
                            <strong>{formatMoney(cartTotal)}</strong>
                        </div>

                        {!tableState.cart.length ? (
                            <p className="mesa-order-empty">
                                Tu carrito esta vacio. Selecciona platos para preparar tu pedido.
                            </p>
                        ) : (
                            <div className="mesa-order-items">
                                {tableState.cart.map((item) => (
                                    <article key={item.id} className="mesa-order-item">
                                        <div>
                                            <h3>{item.nombre}</h3>
                                            <p>{formatMoney(item.unitPrice)} por unidad</p>
                                        </div>
                                        <div className="mesa-order-item__controls">
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={item.quantity}
                                                onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))}
                                            />
                                            <button type="button" onClick={() => handleRemove(item.id)}>
                                                Quitar
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            className="customer-btn-primary mesa-order-submit"
                            onClick={handleSubmitOrder}
                            disabled={!tableState.cart.length || sending || !tableState.sessionToken}
                        >
                            {sending ? "Enviando..." : "Enviar pedido"}
                        </button>
                    </section>

                    <section className="mesa-order-card">
                        <div className="mesa-order-card__header">
                            <div>
                                <p className="public-eyebrow">Tus pedidos</p>
                                <h2>Historico de esta sesion</h2>
                            </div>
                            <strong>{publicOrders.length}</strong>
                        </div>

                        {!publicOrders.length ? (
                            <p className="mesa-order-empty">
                                Todavia no hay pedidos enviados desde esta sesion.
                            </p>
                        ) : (
                            <div className="mesa-order-history">
                                {publicOrders.map((pedido) => (
                                    <article key={pedido.idPedido} className="mesa-order-history__item">
                                        <div className="mesa-order-history__top">
                                            <strong>{formatMoney(pedido.total)}</strong>
                                            <span>{formatDateTime(pedido.fechaModificacion ?? pedido.fechaPedido)}</span>
                                        </div>
                                        <p className="mesa-order-history__status">
                                            {translatePedidoStatus(resolvePedidoStatus(pedido.estado))}
                                        </p>
                                        <ul>
                                            {pedido.detalles.map((detalle) => (
                                                <li key={detalle.idDetallePedido}>
                                                    {detalle.cantidad} x {detalle.platoNombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </section>
        </section>
    );
}
