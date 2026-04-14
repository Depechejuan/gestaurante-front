import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import getToken from "../services/get-token";
import { getCliente, toggleClienteActivo, updateCliente } from "../services/clientes";
import "../styles/Staff/operations.css";

function resolveClienteLabel(cliente) {
    return cliente?.fiscalName || `${cliente?.firstName ?? ""} ${cliente?.lastName ?? ""}`.trim() || cliente?.email || "Cliente";
}

function resolveClienteStatus(cliente) {
    if (!cliente?.activo)
        return { label: "Desactivado", badgeClass: "ops-badge--cancelado" };

    if (cliente.emailVerificado)
        return { label: "Email verificado", badgeClass: "ops-badge--listo" };

    return { label: "Pendiente de verificar", badgeClass: "ops-badge--pendiente" };
}

export default function UniqueCliente() {
    const { id } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [token] = useState(() => getToken());
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const isStaffContext = location.pathname.startsWith("/staff/");
    const isEditing = searchParams.get("edit") === "1";

    useEffect(() => {
        if (!id || !token?.token) {
            setLoading(false);
            return;
        }

        const loadCliente = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getCliente(id, token);
                const nextCliente = response?.data ?? null;
                setCliente(nextCliente);
                setEditForm(nextCliente ? {
                    email: nextCliente.email ?? "",
                    fiscalName: nextCliente.fiscalName ?? "",
                    firstName: nextCliente.firstName ?? "",
                    lastName: nextCliente.lastName ?? "",
                    phone: nextCliente.phone ?? "",
                    dni: nextCliente.dni ?? "",
                    cif: nextCliente.cif ?? "",
                    billingStreet: nextCliente.billingStreet ?? "",
                    billingCity: nextCliente.billingCity ?? "",
                    billingProvince: nextCliente.billingProvince ?? "",
                    billingPostalCode: nextCliente.billingPostalCode ?? "",
                    emailVerificado: Boolean(nextCliente.emailVerificado)
                } : null);
            } catch (err) {
                setError(err.message || "No se ha podido cargar la ficha del cliente.");
            } finally {
                setLoading(false);
            }
        };

        loadCliente();
    }, [id, token]);

    const status = useMemo(() => resolveClienteStatus(cliente), [cliente]);

    const toggleEdit = () => {
        const nextParams = new URLSearchParams(searchParams);

        if (isEditing)
            nextParams.delete("edit");
        else
            nextParams.set("edit", "1");

        setSearchParams(nextParams, { replace: true });
        setFeedback("");
        setError("");
    };

    const handleEditChange = (field, value) => {
        setEditForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!cliente || !editForm)
            return;

        setSaving(true);
        setError("");
        setFeedback("");
        try {
            const response = await updateCliente(cliente.idUsuarioCliente, editForm, token);
            const updatedCliente = response?.data ?? cliente;
            setCliente(updatedCliente);
            setEditForm({
                email: updatedCliente.email ?? "",
                fiscalName: updatedCliente.fiscalName ?? "",
                firstName: updatedCliente.firstName ?? "",
                lastName: updatedCliente.lastName ?? "",
                phone: updatedCliente.phone ?? "",
                dni: updatedCliente.dni ?? "",
                cif: updatedCliente.cif ?? "",
                billingStreet: updatedCliente.billingStreet ?? "",
                billingCity: updatedCliente.billingCity ?? "",
                billingProvince: updatedCliente.billingProvince ?? "",
                billingPostalCode: updatedCliente.billingPostalCode ?? "",
                emailVerificado: Boolean(updatedCliente.emailVerificado)
            });
            setFeedback("Cliente actualizado correctamente.");
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("edit");
            setSearchParams(nextParams, { replace: true });
        } catch (err) {
            setError(err.message || "No se ha podido actualizar el cliente.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActivo = async () => {
        if (!cliente)
            return;

        setToggling(true);
        setError("");
        setFeedback("");
        try {
            const response = await toggleClienteActivo(cliente.idUsuarioCliente, !cliente.activo, token);
            const updatedCliente = response?.data ?? cliente;
            setCliente(updatedCliente);
            setFeedback(updatedCliente.activo ? "Cliente activado correctamente." : "Cliente desactivado correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido cambiar el estado del cliente.");
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando ficha de cliente...</p>
                </div>
            </section>
        );
    }

    if (!cliente) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>{error || "No se ha podido recuperar la información del cliente."}</p>
                    <Link className="staff-ops-secondary staff-ops-secondary--link" to={isStaffContext ? "/staff/clientes" : "/dashboard/clientes"}>
                        Volver al listado
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{isStaffContext ? "Sala" : "Administracion"}</p>
                    <h1>{resolveClienteLabel(cliente)}</h1>
                    <p>Consulta completa de identidad, estado y datos fiscales del cliente.</p>
                </div>
                <div className="staff-ops-actions">
                    <span className={`mesa-detail-card__label ops-badge ${status.badgeClass}`}>{status.label}</span>
                    <Link className="staff-ops-secondary staff-ops-secondary--link" to={isStaffContext ? "/staff/clientes" : "/dashboard/clientes"}>
                        Volver al listado
                    </Link>
                    {!isStaffContext && (
                        <>
                            <button type="button" className="staff-ops-secondary" onClick={toggleEdit}>
                                {isEditing ? "Cancelar" : "Editar cliente"}
                            </button>
                            <button
                                type="button"
                                className={cliente.activo ? "staff-ops-danger" : "staff-ops-primary"}
                                onClick={handleToggleActivo}
                                disabled={toggling}
                            >
                                {toggling ? "Guardando..." : cliente.activo ? "Desactivar cliente" : "Activar cliente"}
                            </button>
                        </>
                    )}
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

            <div className="mesa-detail-grid">
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Cliente</span>
                    <h3>{resolveClienteLabel(cliente)}</h3>
                    <p className="ops-inline-meta">{cliente.email}</p>
                    <ul>
                        <li>Nombre: {cliente.firstName || "No indicado"}</li>
                        <li>Apellidos: {cliente.lastName || "No indicados"}</li>
                        <li>Telefono: {cliente.phone || "Sin telefono"}</li>
                    </ul>
                </article>

                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Datos fiscales</span>
                    <ul>
                        <li>Nombre fiscal: {cliente.fiscalName || "No indicado"}</li>
                        <li>DNI: {cliente.dni || "No indicado"}</li>
                        <li>CIF: {cliente.cif || "No indicado"}</li>
                        <li>Email verificado: {cliente.emailVerificado ? "Si" : "No"}</li>
                    </ul>
                </article>

                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Direccion fiscal</span>
                    <ul>
                        <li>Calle: {cliente.billingStreet || "No indicada"}</li>
                        <li>Ciudad: {cliente.billingCity || "No indicada"}</li>
                        <li>Provincia: {cliente.billingProvince || "No indicada"}</li>
                        <li>Codigo postal: {cliente.billingPostalCode || "No indicado"}</li>
                    </ul>
                </article>
            </div>

            {!isStaffContext && isEditing && editForm && (
                <form className="ops-inline-form ops-inline-form--full" onSubmit={handleSubmit}>
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
        </section>
    );
}
