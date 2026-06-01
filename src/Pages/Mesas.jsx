import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDialog } from "../Context/AppDialogContext";
import getToken from "../services/get-token";
import { createMesa, deleteMesa, getMesas, updateMesa } from "../services/mesas";
import useMesaLabels from "../Hooks/useMesaLabels";
import { compareMesasByPublicOrder } from "../utils/mesas";
import { formatMoney } from "../utils/operations";
import "../styles/Staff/operations.css";

const EMPTY_FORM = {
    capacidad: 4,
    estado: true,
    ubicacion: ""
};

function MesaForm({ value, onChange, onSubmit, onCancel, submitLabel, busy }) {
    return (
        <form className="ops-inline-form" onSubmit={onSubmit}>
            <div className="ops-inline-form__grid">
                <label>
                    <span>Ubicacion</span>
                    <input
                        type="text"
                        value={value.ubicacion}
                        onChange={(event) => onChange((prev) => ({ ...prev, ubicacion: event.target.value }))}
                        required
                    />
                </label>
                <label>
                    <span>Capacidad</span>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={value.capacidad}
                        onChange={(event) => onChange((prev) => ({ ...prev, capacidad: Number(event.target.value) }))}
                        required
                    />
                </label>
                <label className="ops-inline-form__checkbox">
                    <input
                        type="checkbox"
                        checked={Boolean(value.estado)}
                        onChange={(event) => onChange((prev) => ({ ...prev, estado: event.target.checked }))}
                    />
                    <span>Mesa disponible</span>
                </label>
            </div>

            <div className="staff-ops-actions">
                <button type="submit" className="staff-ops-primary" disabled={busy}>
                    {busy ? "Guardando..." : submitLabel}
                </button>
                <button type="button" className="staff-ops-secondary" onClick={onCancel} disabled={busy}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default function Mesas() {
    const token = getToken();
    const location = useLocation();
    const isAdminView = location.pathname.startsWith("/dashboard");

    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [createForm, setCreateForm] = useState(EMPTY_FORM);
    const [editingMesaId, setEditingMesaId] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const { getMesaShortLabel } = useMesaLabels(Boolean(token?.token));
    const { confirm } = useAppDialog();
    const visibleMesas = useMemo(() => [...mesas].sort(compareMesasByPublicOrder), [mesas]);

    const detailBasePath = isAdminView ? "/dashboard/mesas" : "/staff/mesas";

    const loadMesas = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getMesas(token);
            setMesas(response?.data ?? []);
        } catch (err) {
            setError(err.message || "No hemos podido cargar las mesas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMesas();
    }, []);

    const handleCreate = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        setFeedback("");
        try {
            await createMesa(createForm, token);
            setCreateForm(EMPTY_FORM);
            setIsCreating(false);
            setFeedback("Mesa creada correctamente.");
            await loadMesas();
        } catch (err) {
            setError(err.message || "No se ha podido crear la mesa.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartEdit = (mesa) => {
        setEditingMesaId(mesa.idMesa);
        setEditForm({
            capacidad: mesa.capacidad,
            estado: mesa.estado,
            ubicacion: mesa.ubicacion
        });
        setError("");
        setFeedback("");
    };

    const handleSaveEdit = async (event) => {
        event.preventDefault();
        if (!editingMesaId)
            return;

        setSubmitting(true);
        setError("");
        setFeedback("");
        try {
            await updateMesa(editingMesaId, editForm, token);
            setEditingMesaId(null);
            setFeedback("Mesa actualizada correctamente.");
            await loadMesas();
        } catch (err) {
            setError(err.message || "No se ha podido actualizar la mesa.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (mesa) => {
        const confirmed = await confirm({
            title: "Eliminar mesa",
            message: `¿Seguro que quieres eliminar la mesa de ${mesa.ubicacion}?`,
            confirmLabel: "Eliminar"
        });
        if (!confirmed)
            return;

        setError("");
        setFeedback("");
        try {
            await deleteMesa(mesa.idMesa, token);
            setFeedback("Mesa eliminada correctamente.");
            await loadMesas();
        } catch (err) {
            setError(err.message || "No se ha podido eliminar la mesa.");
        }
    };

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{isAdminView ? "Backoffice" : "Sala"}</p>
                    <h1>Mesas</h1>
                    <p>
                        Vista operativa conectada al backend. Desde aqui puedes crear, editar, abrir
                        y revisar el estado real de cada mesa.
                    </p>
                </div>

                <button
                    type="button"
                    className="staff-ops-primary"
                    onClick={() => {
                        setIsCreating((prev) => !prev);
                        setEditingMesaId(null);
                    }}
                >
                    {isCreating ? "Ocultar formulario" : "Anadir mesa"}
                </button>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {feedback && (
                <div className="staff-ops-warning staff-ops-warning--success">
                    <strong>Hecho</strong>
                    <p>{feedback}</p>
                </div>
            )}

            {isCreating && (
                <MesaForm
                    value={createForm}
                    onChange={setCreateForm}
                    onSubmit={handleCreate}
                    onCancel={() => {
                        setIsCreating(false);
                        setCreateForm(EMPTY_FORM);
                    }}
                    submitLabel="Crear mesa"
                    busy={submitting}
                />
            )}

            {loading ? (
                <div className="staff-ops-empty">
                    <p>Cargando mesas...</p>
                </div>
            ) : !mesas.length ? (
                <div className="staff-ops-empty">
                    <p>No hay mesas registradas todavia.</p>
                </div>
            ) : (
                <section className="mesas-grid">
                    {visibleMesas.map((mesa) => {
                        const isEditing = editingMesaId === mesa.idMesa;
                        return (
                            <article key={mesa.idMesa} className="mesa-card">
                                <div className="mesa-card__top">
                                    <span className={`mesa-state ${mesa.estado ? "mesa-state--libre" : "mesa-state--ocupada"}`}>
                                        {mesa.estado ? "Disponible" : "Con servicio"}
                                    </span>
                                    <span className="mesa-zone">{mesa.ubicacion}</span>
                                </div>

                                <h2>{getMesaShortLabel(mesa.idMesa)}</h2>
                                <p>{mesa.capacidad} personas · {mesa.pedidosAbiertos} pedidos activos</p>

                                <div className="mesa-card__meta">
                                    <span>{mesa.tienePedidosActivos ? "Pendiente de cierre" : "Sin consumo pendiente"}</span>
                                    <strong>{formatMoney(mesa.totalPendienteFactura)}</strong>
                                </div>

                                <div className="staff-ops-actions staff-ops-actions--card">
                                    <Link to={`${detailBasePath}/${mesa.idMesa}`} className="staff-ops-secondary staff-ops-secondary--link">
                                        Abrir mesa
                                    </Link>
                                    <button type="button" className="staff-ops-secondary" onClick={() => handleStartEdit(mesa)}>
                                        Editar
                                    </button>
                                    <button type="button" className="staff-ops-secondary" onClick={() => handleDelete(mesa)}>
                                        Borrar
                                    </button>
                                </div>

                                {isEditing && (
                                    <MesaForm
                                        value={editForm}
                                        onChange={setEditForm}
                                        onSubmit={handleSaveEdit}
                                        onCancel={() => setEditingMesaId(null)}
                                        submitLabel="Guardar cambios"
                                        busy={submitting}
                                    />
                                )}
                            </article>
                        );
                    })}
                </section>
            )}
        </section>
    );
}
