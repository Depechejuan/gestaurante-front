import { useEffect, useState } from "react";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { createCustomerAddress, deleteCustomerAddress, getCustomerAddresses, updateCustomerAddress } from "../services/customer-account";

const emptyForm = { alias: "", street: "", city: "", province: "", postalCode: "", notes: "", isDefault: false };

export default function CustomerAddresses() {
    const { token } = useCustomerAuth();
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState("");
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");

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
                await updateCustomerAddress(editingId, form, token.token);
                setFeedback("Dirección actualizada.");
            } else {
                await createCustomerAddress(form, token.token);
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
        <section className="staff-ops-shell">
            <div className="staff-ops-header"><h1>Direcciones</h1></div>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}
            <form onSubmit={handleSubmit} className="customer-contact-form">
                <input placeholder="Alias" value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} required />
                <input placeholder="Calle" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
                <input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                <input placeholder="Provincia" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
                <input placeholder="Código postal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
                <input placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <label><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Predeterminada</label>
                <button type="submit" className="customer-contact-form__submit">{editingId ? "Actualizar dirección" : "Guardar dirección"}</button>
                {editingId ? (
                    <button type="button" className="staff-ops-secondary" onClick={() => { setEditingId(""); setForm(emptyForm); }}>
                        Cancelar edición
                    </button>
                ) : null}
            </form>
            <div className="comandas-list">
                {addresses.map((address) => (
                    <article key={address.idClienteDireccion} className="comanda-card">
                        <h3>{address.alias}</h3>
                        <p>{address.street}, {address.postalCode} {address.city}, {address.province}</p>
                        <p>{address.isDefault ? "Predeterminada" : "Secundaria"}</p>
                        <div className="mesa-order-item__actions">
                            <button
                                type="button"
                                className="staff-ops-secondary"
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
        </section>
    );
}
