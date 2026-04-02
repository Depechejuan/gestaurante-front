import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import getToken from "../services/get-token";
import { getClientes, toggleClienteActivo, updateCliente } from "../services/clientes";
import "../styles/Staff/operations.css";

function resolveClienteLabel(cliente) {
    return cliente.fiscalName || `${cliente.firstName} ${cliente.lastName}`.trim() || cliente.email;
}

export default function Clientes() {
    const location = useLocation();
    const token = getToken();
    const [query, setQuery] = useState("");
    const [clientes, setClientes] = useState([]);
    const [editingClientId, setEditingClientId] = useState("");
    const [editForm, setEditForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [togglingClientId, setTogglingClientId] = useState("");
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const isStaffContext = location.pathname.startsWith("/staff/");

    useEffect(() => {
        const loadClientes = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getClientes(token, query);
                setClientes(response?.data ?? []);
            } catch (err) {
                setError(err.message || "No se ha podido cargar la lista de clientes.");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = window.setTimeout(loadClientes, query.trim() ? 250 : 0);
        return () => window.clearTimeout(timeoutId);
    }, [query]);

    const titleCopy = useMemo(() => ({
        eyebrow: isStaffContext ? "Sala" : "Administracion",
        title: "Clientes",
        description: isStaffContext
            ? "Consulta rapida de clientes para cobro, facturas y vinculacion fiscal."
            : "Base de clientes registrada para pedidos online, facturacion y seguimiento."
    }), [isStaffContext]);

    const openEdit = (cliente) => {
        setEditingClientId(cliente.idUsuarioCliente);
        setEditForm({
            email: cliente.email ?? "",
            fiscalName: cliente.fiscalName ?? "",
            firstName: cliente.firstName ?? "",
            lastName: cliente.lastName ?? "",
            phone: cliente.phone ?? "",
            dni: cliente.dni ?? "",
            cif: cliente.cif ?? "",
            billingStreet: cliente.billingStreet ?? "",
            billingCity: cliente.billingCity ?? "",
            billingProvince: cliente.billingProvince ?? "",
            billingPostalCode: cliente.billingPostalCode ?? "",
            activo: Boolean(cliente.activo),
            emailVerificado: Boolean(cliente.emailVerificado)
        });
        setFeedback("");
        setError("");
    };

    const closeEdit = () => {
        setEditingClientId("");
        setEditForm(null);
    };

    const handleEditChange = (field, value) => {
        setEditForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const handleUpdateCliente = async (event) => {
        event.preventDefault();
        if (!editingClientId || !editForm)
            return;

        setSaving(true);
        setError("");
        setFeedback("");
        try {
            const response = await updateCliente(editingClientId, editForm, token);
            const updatedCliente = response?.data;
            setClientes((currentClientes) => currentClientes.map((cliente) =>
                cliente.idUsuarioCliente === editingClientId ? updatedCliente : cliente
            ));
            setFeedback("Cliente actualizado correctamente.");
            closeEdit();
        } catch (err) {
            setError(err.message || "No se ha podido actualizar el cliente.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActivo = async (cliente) => {
        setTogglingClientId(cliente.idUsuarioCliente);
        setError("");
        setFeedback("");
        try {
            const response = await toggleClienteActivo(cliente.idUsuarioCliente, !cliente.activo, token);
            const updatedCliente = response?.data;
            setClientes((currentClientes) => currentClientes.map((currentCliente) =>
                currentCliente.idUsuarioCliente === cliente.idUsuarioCliente ? updatedCliente : currentCliente
            ));
            if (editingClientId === cliente.idUsuarioCliente && editForm) {
                setEditForm((currentForm) => ({
                    ...currentForm,
                    activo: updatedCliente.activo,
                    emailVerificado: updatedCliente.emailVerificado
                }));
            }
            setFeedback(updatedCliente.activo ? "Cliente activado correctamente." : "Cliente desactivado correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido cambiar el estado del cliente.");
        } finally {
            setTogglingClientId("");
        }
    };

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{titleCopy.eyebrow}</p>
                    <h1>{titleCopy.title}</h1>
                    <p>{titleCopy.description}</p>
                </div>
                <div className="staff-ops-actions">
                    <label className="ops-search">
                        <span>Buscar</span>
                        <input
                            type="search"
                            placeholder="Email, nombre, DNI o CIF"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </label>
                </div>
            </div>

            {feedback && (
                <div className="staff-ops-warning staff-ops-warning--success">
                    <strong>Hecho</strong>
                    <p>{feedback}</p>
                </div>
            )}

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="staff-ops-empty">
                    <p>Cargando clientes...</p>
                </div>
            ) : !clientes.length ? (
                <div className="staff-ops-empty">
                    <p>No hay clientes que coincidan con la búsqueda actual.</p>
                </div>
            ) : (
                <div className="comandas-list">
                    {clientes.map((cliente) => (
                        <article key={cliente.idUsuarioCliente} className="comanda-card">
                            <div className="comanda-card__top">
                                <div>
                                    <span className={`mesa-detail-card__label ops-badge ${cliente.emailVerificado ? "ops-badge--listo" : "ops-badge--pendiente"}`}>
                                        {cliente.emailVerificado ? "Email verificado" : "Pendiente de validar"}
                                    </span>
                                    <h3>{resolveClienteLabel(cliente)}</h3>
                                </div>
                                <span className={`mesa-detail-card__label ops-badge ${cliente.activo ? "ops-badge--listo" : "ops-badge--cancelado"}`}>
                                    {cliente.activo ? "Activo" : "Inactivo"}
                                </span>
                            </div>

                            <p className="ops-inline-meta">{cliente.email}</p>

                            <ul>
                                <li>Telefono: {cliente.phone || "Sin telefono"}</li>
                                <li>DNI: {cliente.dni || "No indicado"}</li>
                                <li>CIF: {cliente.cif || "No indicado"}</li>
                                <li>
                                    Direccion fiscal: {cliente.billingStreet
                                        ? `${cliente.billingStreet}, ${cliente.billingPostalCode} ${cliente.billingCity}, ${cliente.billingProvince}`
                                        : "No configurada"}
                                </li>
                            </ul>

                            {!isStaffContext && (
                                <div className="staff-ops-actions staff-ops-actions--card">
                                    <button
                                        type="button"
                                        className="staff-ops-secondary"
                                        onClick={() => editingClientId === cliente.idUsuarioCliente ? closeEdit() : openEdit(cliente)}
                                    >
                                        {editingClientId === cliente.idUsuarioCliente ? "Cancelar" : "Editar cliente"}
                                    </button>
                                    <button
                                        type="button"
                                        className={cliente.activo ? "staff-ops-danger" : "staff-ops-primary"}
                                        onClick={() => handleToggleActivo(cliente)}
                                        disabled={togglingClientId === cliente.idUsuarioCliente}
                                    >
                                        {togglingClientId === cliente.idUsuarioCliente
                                            ? "Guardando..."
                                            : cliente.activo
                                                ? "Desactivar cliente"
                                                : "Activar cliente"}
                                    </button>
                                </div>
                            )}

                            {!isStaffContext && editingClientId === cliente.idUsuarioCliente && editForm && (
                                <form className="ops-inline-form ops-inline-form--full" onSubmit={handleUpdateCliente}>
                                    <div className="ops-inline-form__grid">
                                        <label>
                                            Email
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(event) => handleEditChange("email", event.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Nombre fiscal
                                            <input
                                                type="text"
                                                value={editForm.fiscalName}
                                                onChange={(event) => handleEditChange("fiscalName", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Nombre
                                            <input
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={(event) => handleEditChange("firstName", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Apellidos
                                            <input
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={(event) => handleEditChange("lastName", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Telefono
                                            <input
                                                type="text"
                                                value={editForm.phone}
                                                onChange={(event) => handleEditChange("phone", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            DNI
                                            <input
                                                type="text"
                                                value={editForm.dni}
                                                onChange={(event) => handleEditChange("dni", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            CIF
                                            <input
                                                type="text"
                                                value={editForm.cif}
                                                onChange={(event) => handleEditChange("cif", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Direccion fiscal
                                            <input
                                                type="text"
                                                value={editForm.billingStreet}
                                                onChange={(event) => handleEditChange("billingStreet", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Ciudad
                                            <input
                                                type="text"
                                                value={editForm.billingCity}
                                                onChange={(event) => handleEditChange("billingCity", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Provincia
                                            <input
                                                type="text"
                                                value={editForm.billingProvince}
                                                onChange={(event) => handleEditChange("billingProvince", event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Codigo postal
                                            <input
                                                type="text"
                                                value={editForm.billingPostalCode}
                                                onChange={(event) => handleEditChange("billingPostalCode", event.target.value)}
                                            />
                                        </label>
                                    </div>

                                    <div className="ops-inline-form__checks">
                                        <label className="ops-inline-form__checkbox">
                                            <input
                                                type="checkbox"
                                                checked={editForm.emailVerificado}
                                                onChange={(event) => handleEditChange("emailVerificado", event.target.checked)}
                                            />
                                            Email verificado
                                        </label>
                                    </div>

                                    <div className="staff-ops-actions">
                                        <button type="submit" className="staff-ops-primary" disabled={saving}>
                                            {saving ? "Guardando..." : "Guardar cambios"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
