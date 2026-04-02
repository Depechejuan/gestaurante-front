import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { getCustomerOrders, updateCustomerProfile } from "../services/customer-account";
import { formatDateTime, formatMoney, translatePedidoStatus } from "../utils/operations";

export default function CustomerAccount() {
    const { customer, token, logout, setCustomer } = useCustomerAuth();
    const [form, setForm] = useState({
        firstName: customer?.firstName ?? "",
        lastName: customer?.lastName ?? "",
        phone: customer?.phone ?? "",
        fiscalName: customer?.fiscalName ?? "",
        dni: customer?.dni ?? "",
        cif: customer?.cif ?? "",
        billingStreet: customer?.billingStreet ?? "",
        billingCity: customer?.billingCity ?? "",
        billingProvince: customer?.billingProvince ?? "",
        billingPostalCode: customer?.billingPostalCode ?? ""
    });
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        setForm({
            firstName: customer?.firstName ?? "",
            lastName: customer?.lastName ?? "",
            phone: customer?.phone ?? "",
            fiscalName: customer?.fiscalName ?? "",
            dni: customer?.dni ?? "",
            cif: customer?.cif ?? "",
            billingStreet: customer?.billingStreet ?? "",
            billingCity: customer?.billingCity ?? "",
            billingProvince: customer?.billingProvince ?? "",
            billingPostalCode: customer?.billingPostalCode ?? ""
        });
    }, [customer?.firstName, customer?.lastName, customer?.phone, customer?.fiscalName, customer?.dni, customer?.cif, customer?.billingStreet, customer?.billingCity, customer?.billingProvince, customer?.billingPostalCode]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await getCustomerOrders(token.token);
                setRecentOrders((response?.data ?? []).slice(0, 3));
            } catch {
                setRecentOrders([]);
            }
        };

        if (token?.token)
            loadOrders();
    }, [token?.token]);

    const links = [
        { to: "/pedido-online", label: "Pedir online", description: "Haz un pedido de recogida o delivery." },
        { to: "/cuenta/pedidos", label: "Mis pedidos", description: "Consulta tu histórico y el estado actual." },
        { to: "/cuenta/direcciones", label: "Direcciones", description: "Gestiona tus direcciones guardadas." },
        { to: "/cuenta/metodos-pago", label: "Métodos de pago", description: "Guarda y reutiliza tus métodos de pago." }
    ];
    const latestOrder = useMemo(() => recentOrders[0] ?? null, [recentOrders]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setFeedback("");
        try {
            const response = await updateCustomerProfile(form, token.token);
            setCustomer(response?.data ?? null);
            setFeedback("Perfil actualizado.");
        } catch (err) {
            setError(err.message || "No se ha podido actualizar tu perfil.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero">
                <div>
                    <p className="public-eyebrow">Área cliente</p>
                    <h1>{customer?.firstName} {customer?.lastName}</h1>
                    <p>{customer?.email}</p>
                </div>
                <button type="button" className="staff-ops-secondary" onClick={logout}>Cerrar sesión</button>
            </section>

            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}

            <form onSubmit={handleSubmit} className="customer-contact-form">
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Nombre" required />
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Apellidos" required />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Teléfono" required />
                <input value={form.fiscalName} onChange={(e) => setForm({ ...form, fiscalName: e.target.value })} placeholder="Nombre fiscal o razón social" />
                <div className="invoice-assign__row">
                    <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value, cif: "" })} placeholder="DNI" />
                    <input value={form.cif} onChange={(e) => setForm({ ...form, cif: e.target.value, dni: "" })} placeholder="CIF" />
                </div>
                <input value={form.billingStreet} onChange={(e) => setForm({ ...form, billingStreet: e.target.value })} placeholder="Dirección fiscal" />
                <div className="invoice-assign__row">
                    <input value={form.billingPostalCode} onChange={(e) => setForm({ ...form, billingPostalCode: e.target.value })} placeholder="Código postal" />
                    <input value={form.billingCity} onChange={(e) => setForm({ ...form, billingCity: e.target.value })} placeholder="Ciudad" />
                    <input value={form.billingProvince} onChange={(e) => setForm({ ...form, billingProvince: e.target.value })} placeholder="Provincia" />
                </div>
                <button type="submit" className="customer-contact-form__submit" disabled={saving}>
                    {saving ? "Guardando..." : "Actualizar perfil"}
                </button>
            </form>

            <section className="staff-dashboard__grid">
                {links.map((link) => (
                    <Link key={link.to} to={link.to} className="staff-dashboard__card">
                        <h3>{link.label}</h3>
                        <p>{link.description}</p>
                    </Link>
                ))}
            </section>

            <section className="checkout-section">
                <div className="checkout-section__header">
                    <span className="checkout-section__step">1</span>
                    <div>
                        <h2>Actividad reciente</h2>
                        <p>Ten a mano tu perfil, tus direcciones y tus últimos pedidos para repetir más rápido.</p>
                    </div>
                </div>
                <div className="staff-dashboard__grid">
                    <article className="staff-dashboard__card">
                        <h3>Pedidos recientes</h3>
                        <p>{recentOrders.length ? `${recentOrders.length} pedidos visibles en tu panel.` : "Todavía no has hecho pedidos online."}</p>
                    </article>
                    <article className="staff-dashboard__card">
                        <h3>Último pedido</h3>
                        <p>{latestOrder ? `${translatePedidoStatus(latestOrder.estado)} · ${formatMoney(latestOrder.total)}` : "Cuando hagas tu primer pedido aparecerá aquí."}</p>
                    </article>
                </div>
                {recentOrders.length ? (
                    <div className="comandas-list">
                        {recentOrders.map((order) => (
                            <article key={order.idPedido} className="comanda-card">
                                <div className="comanda-card__top">
                                    <div>
                                        <h3>Pedido {String(order.idPedido).slice(0, 8)}</h3>
                                        <p>{translatePedidoStatus(order.estado)} · {formatDateTime(order.fechaPedido)}</p>
                                    </div>
                                    <strong>{formatMoney(order.total)}</strong>
                                </div>
                                <Link to="/cuenta/pedidos" className="plato-detail-link">Ver histórico completo</Link>
                            </article>
                        ))}
                    </div>
                ) : null}
            </section>
        </section>
    );
}
