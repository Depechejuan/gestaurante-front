import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { updateCustomerProfile } from "../services/customer-account";

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

    const links = [
        { to: "/pedido-online", label: "Pedir online", description: "Haz un pedido de recogida o delivery." },
        { to: "/cuenta/pedidos", label: "Mis pedidos", description: "Consulta tu histórico y el estado actual." },
        { to: "/cuenta/direcciones", label: "Direcciones", description: "Gestiona tus direcciones guardadas." },
        { to: "/cuenta/metodos-pago", label: "Métodos de pago", description: "Guarda y reutiliza pagos mock." }
    ];

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
        </section>
    );
}
