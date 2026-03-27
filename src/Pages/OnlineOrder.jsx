import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import ListPlatosPublic from "../Components/ListPlatosPublic";
import { getCustomerAddresses, getCustomerPaymentMethods } from "../services/customer-account";
import { getPublicCatalog } from "../services/public-catalog";
import { addOnlineCartItem, clearOnlineCart, getOnlineCart, removeOnlineCartItem, updateOnlineCartItem } from "../services/online-order-storage";
import { createOnlineOrder } from "../services/online-order";
import { formatMoney } from "../utils/operations";

function resolvePlatoType(plato, index) {
    return plato.categoriaDescripcion || plato.categoria || ["Entrantes", "Platos", "Postres"][index % 3];
}

export default function OnlineOrder() {
    const { customer, token, hasCustomerSession } = useCustomerAuth();
    const [platos, setPlatos] = useState([]);
    const [cart, setCart] = useState(() => getOnlineCart());
    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [tipoEntrega, setTipoEntrega] = useState("RECOGIDA");
    const [pagarOnline, setPagarOnline] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [useSavedPaymentMethod, setUseSavedPaymentMethod] = useState(true);
    const [newCard, setNewCard] = useState({
        cardNumber: "",
        holderName: "",
        expMonth: "",
        expYear: "",
        saveForFuture: true
    });
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [catalogResponse, addressesResponse, methodsResponse] = await Promise.all([
                    getPublicCatalog(),
                    hasCustomerSession ? getCustomerAddresses(token.token) : Promise.resolve({ data: [] }),
                    hasCustomerSession ? getCustomerPaymentMethods(token.token) : Promise.resolve({ data: [] })
                ]);
                setPlatos((catalogResponse?.data ?? []).map((plato, index) => ({ ...plato, tipoVisible: resolvePlatoType(plato, index) })));
                const nextAddresses = addressesResponse?.data ?? [];
                const nextMethods = methodsResponse?.data ?? [];
                setAddresses(nextAddresses);
                setPaymentMethods(nextMethods);
                setSelectedAddress(nextAddresses.find((address) => address.isDefault)?.idClienteDireccion ?? "");
                setSelectedPaymentMethod(nextMethods.find((method) => method.isDefault)?.idClienteMetodoPago ?? "");
            } catch (err) {
                setError(err.message || "No se ha podido cargar el catálogo online.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [hasCustomerSession, token?.token]);

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [cart]);

    const handleAddToCart = (plato, quantity) => {
        const next = addOnlineCartItem({
            id: plato.idPlato ?? plato.id,
            backendId: plato.idPlato ?? plato.id,
            nombre: plato.nombre,
            quantity,
            unitPrice: Number(plato.precio ?? 0),
            tipoVisible: plato.tipoVisible
        });
        setCart(next);
    };

    const handleSubmit = async () => {
        if (!hasCustomerSession) {
            setError("Debes iniciar sesión como cliente para pedir online.");
            return;
        }

        if (!cart.length) {
            setError("Añade al menos un plato al carrito antes de confirmar.");
            return;
        }

        if (tipoEntrega === "DOMICILIO" && !selectedAddress) {
            setError("Debes seleccionar una dirección para los pedidos a domicilio.");
            return;
        }

        if (pagarOnline && useSavedPaymentMethod && !selectedPaymentMethod) {
            setError("Selecciona un método de pago guardado o introduce una tarjeta nueva.");
            return;
        }

        setSending(true);
        setError("");
        setFeedback("");
        try {
            const response = await createOnlineOrder({
                tipoEntrega,
                pagarOnline,
                idClienteDireccion: tipoEntrega === "DOMICILIO" ? selectedAddress || null : null,
                detalles: cart.map((item) => ({
                    idPlato: item.backendId,
                    cantidad: item.quantity
                })),
                paymentMethod: pagarOnline
                    ? (
                        useSavedPaymentMethod
                            ? { idClienteMetodoPago: selectedPaymentMethod || null }
                            : {
                                cardNumber: newCard.cardNumber,
                                holderName: newCard.holderName,
                                expMonth: newCard.expMonth ? Number(newCard.expMonth) : null,
                                expYear: newCard.expYear ? Number(newCard.expYear) : null,
                                saveForFuture: newCard.saveForFuture
                            }
                    )
                    : null
            }, token.token);

            clearOnlineCart();
            setCart([]);
            setNewCard({
                cardNumber: "",
                holderName: "",
                expMonth: "",
                expYear: "",
                saveForFuture: true
            });
            setFeedback(`Pedido ${String(response?.data?.idPedido ?? "").slice(0, 8)} creado correctamente.`);
        } catch (err) {
            setError(err.message || "No se ha podido crear el pedido online.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <section className="public-page public-page--menu"><p>Cargando catálogo online...</p></section>;
    }

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero">
                <div>
                    <p className="public-eyebrow">Pedido online</p>
                    <h1>Recogida o entrega a domicilio</h1>
                    <p>{hasCustomerSession ? `Sesión activa de ${customer?.firstName}.` : "Inicia sesión para completar tu pedido online."}</p>
                </div>
                {!hasCustomerSession && <Link to="/login" className="staff-ops-primary">Acceder</Link>}
            </section>

            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}

            <section className="mesa-order-shell">
                <div className="mesa-order-main">
                    <ListPlatosPublic platos={platos} onAddToCart={handleAddToCart} />
                </div>
                <aside className="mesa-order-sidebar">
                    <section className="mesa-order-card mesa-order-card--cart">
                        <div className="mesa-order-card__header">
                            <div>
                                <p className="public-eyebrow">Checkout</p>
                                <h2>Tu pedido online</h2>
                            </div>
                            <strong>{formatMoney(total)}</strong>
                        </div>

                        {!cart.length ? (
                            <p className="mesa-order-empty">Tu carrito online está vacío.</p>
                        ) : (
                            <div className="mesa-order-items">
                                {cart.map((item) => (
                                    <article key={item.id} className="mesa-order-item">
                                        <div>
                                            <strong>{item.nombre}</strong>
                                            <p>{formatMoney(item.unitPrice)} · {item.quantity} uds.</p>
                                        </div>
                                        <div className="mesa-order-item__actions">
                                            <input type="number" min="1" value={item.quantity} onChange={(e) => { const next = updateOnlineCartItem(item.id, Number(e.target.value)); setCart(next); }} />
                                            <button type="button" className="staff-ops-secondary" onClick={() => { const next = removeOnlineCartItem(item.id); setCart(next); }}>Quitar</button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <label>Tipo de entrega</label>
                        <select value={tipoEntrega} onChange={(e) => { const next = e.target.value; setTipoEntrega(next); if (next === "DOMICILIO") setPagarOnline(true); }}>
                            <option value="RECOGIDA">Recogida</option>
                            <option value="DOMICILIO">Domicilio</option>
                        </select>

                        <label>
                            <input
                                type="checkbox"
                                checked={pagarOnline}
                                disabled={tipoEntrega === "DOMICILIO"}
                                onChange={(e) => setPagarOnline(e.target.checked)}
                            />
                            Pagar online ahora
                        </label>

                        {tipoEntrega === "DOMICILIO" && (
                            <>
                                <label>Dirección</label>
                                <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                                    <option value="">Selecciona una dirección</option>
                                    {addresses.map((address) => (
                                        <option key={address.idClienteDireccion} value={address.idClienteDireccion}>
                                            {address.alias} · {address.street}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {pagarOnline && (
                            <>
                                <label>Método de pago guardado</label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={useSavedPaymentMethod}
                                        onChange={(e) => setUseSavedPaymentMethod(e.target.checked)}
                                    />
                                    Usar tarjeta guardada
                                </label>

                                {useSavedPaymentMethod ? (
                                    <select value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                                        <option value="">Selecciona una tarjeta guardada</option>
                                        {paymentMethods.map((method) => (
                                            <option key={method.idClienteMetodoPago} value={method.idClienteMetodoPago}>
                                                {method.brand} · **** {method.last4}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Número de tarjeta"
                                            value={newCard.cardNumber}
                                            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Titular"
                                            value={newCard.holderName}
                                            onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                                        />
                                        <div className="mesa-order-item__actions">
                                            <input
                                                type="number"
                                                min="1"
                                                max="12"
                                                placeholder="Mes"
                                                value={newCard.expMonth}
                                                onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                min="2026"
                                                placeholder="Año"
                                                value={newCard.expYear}
                                                onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                                            />
                                        </div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={newCard.saveForFuture}
                                                onChange={(e) => setNewCard({ ...newCard, saveForFuture: e.target.checked })}
                                            />
                                            Guardar para futuros pedidos
                                        </label>
                                    </>
                                )}
                            </>
                        )}

                        <button type="button" className="staff-ops-primary" disabled={sending || !cart.length || !hasCustomerSession} onClick={handleSubmit}>
                            {sending ? "Enviando..." : "Confirmar pedido online"}
                        </button>
                    </section>
                </aside>
            </section>
        </section>
    );
}
