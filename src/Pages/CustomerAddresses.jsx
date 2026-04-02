import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { createCustomerAddress, deleteCustomerAddress, getCustomerAddresses, updateCustomerAddress } from "../services/customer-account";
import "../styles/Customer/form.css";

const emptyForm = { alias: "", street: "", city: "", province: "", postalCode: "", notes: "", isDefault: false };

export default function CustomerAddresses() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useCustomerAuth();
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState("");
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const redirect = useMemo(() => new URLSearchParams(location.search).get("redirect") ?? "", [location.search]);

    const load = async () => {
        try {
            const response = await getCustomerAddresses(token.token);
            setAddresses(response?.data ?? []);
        } catch (err) {
            setError(err.message || "No se han podido cargar las direcciones.");
        }
    };

    useEffect(() => {
        load();
    }, [token?.token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setFeedback("");
        try {
            if (editingId) {
                const response = await updateCustomerAddress(editingId, form, token.token);
                if (redirect) {
                    navigate(redirect, {
                        state: {
                            checkoutMessage: "Dirección actualizada correctamente.",
                            preferredAddressId: response?.data?.idClienteDireccion ?? editingId
                        }
                    });
                    return;
                }
                setFeedback("Dirección actualizada.");
            } else {
                const response = await createCustomerAddress(form, token.token);
                if (redirect) {
                    navigate(redirect, {
                        state: {
                            checkoutMessage: "Dirección guardada correctamente.",
                            preferredAddressId: response?.data?.idClienteDireccion ?? ""
                        }
                    });
                    return;
                }
                setFeedback("Dirección guardada.");
            }
            setForm(emptyForm);
            setEditingId("");
            await load();
        } catch (err) {
            setError(err.message || "No se ha podido guardar la dirección.");
        }
    };

    const handleDelete = async (addressId) => {
        setError("");
        setFeedback("");
        try {
            await deleteCustomerAddress(addressId, token.token);
            await load();
            setFeedback("Dirección eliminada.");
        } catch (err) {
            setError(err.message || "No se ha podido eliminar la dirección.");
        }
    };

    return (
        <section className="staff-ops-shell customer-settings-shell">
            <div className="staff-ops-header customer-settings-header">
                <div>
                    <p className="public-eyebrow">Cuenta cliente</p>
                    <h1>Direcciones de envío</h1>
                    <p>Guarda una o varias direcciones para no repetir datos en cada pedido.</p>
                </div>
                {redirect ? <Link to={redirect} className="customer-btn-secondary customer-btn-secondary--inline">Volver al checkout</Link> : null}
            </div>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}
            <div className="customer-settings-grid">
                <form onSubmit={handleSubmit} className="customer-contact-form customer-settings-card">
                    <div className="customer-form-group">
                        <label>Alias</label>
                        <input placeholder="Casa, trabajo, piso..." value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} required />
                    </div>
                    <div className="customer-form-group">
                        <label>Calle</label>
                        <input placeholder="Calle y número" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
                    </div>
                    <div className="customer-settings-grid customer-settings-grid--compact">
                        <div className="customer-form-group">
                            <label>Ciudad</label>
                            <input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                        </div>
                        <div className="customer-form-group">
                            <label>Provincia</label>
                            <input placeholder="Provincia" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
                        </div>
                    </div>
                    <div className="customer-form-group">
                        <label>Código postal</label>
                        <input placeholder="Código postal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
                    </div>
                    <div className="customer-form-group">
                        <label>Notas</label>
                        <input placeholder="Portal, escalera, referencia..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <label className="customer-check-option">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                        <span>Usar como dirección predeterminada</span>
                    </label>
                    <div className="menu-public__cta-row">
                        <button type="submit" className="customer-btn-primary">{editingId ? "Actualizar dirección" : "Guardar dirección"}</button>
                        {editingId ? (
                            <button type="button" className="customer-btn-secondary customer-btn-secondary--inline" onClick={() => { setEditingId(""); setForm(emptyForm); }}>
                                Cancelar edición
                            </button>
                        ) : null}
                    </div>
                </form>

                <div className="comandas-list customer-settings-list">
                    {addresses.map((address) => (
                        <article key={address.idClienteDireccion} className="comanda-card customer-settings-card">
                            <h3>{address.alias}</h3>
                            <p>{address.street}, {address.postalCode} {address.city}, {address.province}</p>
                            <p>{address.isDefault ? "Predeterminada" : "Secundaria"}</p>
                            <div className="mesa-order-item__actions">
                                <button
                                    type="button"
                                    className="customer-btn-secondary customer-btn-secondary--inline"
                                    onClick={() => {
                                        setEditingId(address.idClienteDireccion);
                                        setForm({
                                            alias: address.alias,
                                            street: address.street,
                                            city: address.city,
                                            province: address.province,
                                            postalCode: address.postalCode,
                                            notes: address.notes ?? "",
                                            isDefault: address.isDefault
                                        });
                                    }}
                                >
                                    Editar
                                </button>
                                <button type="button" className="staff-ops-secondary" onClick={() => handleDelete(address.idClienteDireccion)}>
                                    Borrar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
