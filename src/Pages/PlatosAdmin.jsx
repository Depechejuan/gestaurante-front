import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlatoAdminForm from "../Components/Forms/Plato-Admin-Form";
import { useAppDialog } from "../Context/AppDialogContext";
import { createCategoria, getCategorias } from "../services/categorias";
import { createIngrediente, getIngredientes } from "../services/ingredientes";
import { createPlato, getAdminPlatos, setPlatoDisponibilidad } from "../services/platos";
import getToken from "../services/get-token";
import "../styles/Admin/platos.css";

export default function PlatosAdmin() {
    const token = getToken();
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const { confirm } = useAppDialog();

    const loadPlatos = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAdminPlatos(token);
            setPlatos(response?.data ?? []);
        } catch (err) {
            setError(err.message || "No hemos podido cargar los platos.");
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogDependencies = async () => {
        const [categoriasResponse, ingredientesResponse] = await Promise.all([
            getCategorias(token),
            getIngredientes(token)
        ]);
        setCategorias(categoriasResponse?.data ?? []);
        setIngredientes(ingredientesResponse?.data ?? []);
        return {
            categorias: categoriasResponse?.data ?? [],
            ingredientes: ingredientesResponse?.data ?? []
        };
    };

    useEffect(() => {
        loadPlatos();
        loadCatalogDependencies().catch((err) => {
            setError(err.message || "No se han podido cargar categorías e ingredientes.");
        });
    }, []);

    const resolveCategoria = async (categoriaValue, sourceCategorias = categorias) => {
        const normalized = categoriaValue.trim().toLowerCase();
        const existing = sourceCategorias.find((item) => item.descripcion?.trim().toLowerCase() === normalized);
        if (existing)
            return existing;

        const response = await createCategoria({ descripcion: categoriaValue.trim() }, token);
        const created = response?.data;
        setCategorias((prev) => [...prev, created]);
        return created;
    };

    const resolveIngredientes = async (ingredientesValue, sourceIngredientes = ingredientes) => {
        const names = ingredientesValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const resolved = [];
        let nextIngredientes = [...sourceIngredientes];

        for (const nombre of names) {
            const normalized = nombre.toLowerCase();
            let current = nextIngredientes.find((item) => item.nombre?.trim().toLowerCase() === normalized);
            if (!current) {
                const response = await createIngrediente({
                    nombre,
                    alergenico: false,
                    disponible: true,
                    imagen: ""
                }, token);
                current = response?.data;
                nextIngredientes.push(current);
            }
            resolved.push({
                idIngrediente: current.idIngrediente,
                nombre: current.nombre
            });
        }

        setIngredientes(nextIngredientes);
        return resolved;
    };

    const handleCreate = async (formValues) => {
        setSubmitting(true);
        setError("");
        setFeedback("");
        try {
            const deps = await loadCatalogDependencies();
            const categoria = await resolveCategoria(formValues.categoria, deps.categorias);
            const ingredientesResolved = await resolveIngredientes(formValues.ingredientes, deps.ingredientes);
            await createPlato({
                nombre: formValues.nombre,
                descripcion: formValues.descripcion,
                imagen: formValues.imagen ?? "",
                photo: formValues.photo ?? null,
                disponible: Boolean(formValues.disponible),
                precio: Number(formValues.precio || 0),
                idCategoria: categoria.idCategoria,
                categoriaDescripcion: categoria.descripcion,
                ingredientes: ingredientesResolved
            }, token);
            setFeedback("Plato creado correctamente.");
            await loadPlatos();
        } catch (err) {
            setError(err.message || "No se ha podido crear el plato.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleDisponibilidad = async (plato) => {
        const nextDisponibilidad = !plato.disponible;
        const confirmed = await confirm({
            title: nextDisponibilidad ? "Activar plato" : "Desactivar plato",
            message: nextDisponibilidad
                ? `¿Quieres volver a publicar el plato "${plato.nombre}" en la carta?`
                : `¿Quieres ocultar el plato "${plato.nombre}" para que no pueda pedirse de nuevo?`,
            confirmLabel: nextDisponibilidad ? "Activar" : "Desactivar"
        });
        if (!confirmed)
            return;

        setError("");
        setFeedback("");
        try {
            const response = await setPlatoDisponibilidad(plato.idPlato ?? plato.id, nextDisponibilidad, token);
            const updated = response?.data;
            setPlatos((current) => current.map((item) => (
                (item.idPlato ?? item.id) === (plato.idPlato ?? plato.id) ? updated : item
            )));
            setFeedback(nextDisponibilidad ? "Plato activado correctamente." : "Plato desactivado correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido actualizar la disponibilidad del plato.");
        }
    };

    return (
        <section className="platos-admin-shell">
            <div className="platos-admin-header">
                <div>
                    <p className="plato-eyebrow">Backoffice carta</p>
                    <h1>Platos</h1>
                    <p>
                        Gestiona la carta, revisa disponibilidad y accede a la edicion de cada
                        plato desde un unico panel.
                    </p>
                </div>

                <div className="platos-admin-summary">
                    <span>Registros visibles</span>
                    <strong>{platos?.length ?? 0}</strong>
                </div>
            </div>

            {error && (
                <div className="platos-admin-empty platos-admin-empty--error">
                    <p>{error}</p>
                </div>
            )}

            {feedback && (
                <div className="platos-admin-empty platos-admin-empty--success">
                    <p>{feedback}</p>
                </div>
            )}

            <PlatoAdminForm
                mode="create"
                categorias={categorias}
                onSubmit={handleCreate}
                busy={submitting}
            />

            <section className="platos-admin-list">
                <div className="platos-admin-list__header">
                    <h2>Platos existentes</h2>
                    <p>Acceso a una ficha de edicion por cada registro disponible.</p>
                </div>

                {!platos?.length ? (
                    <div className="platos-admin-empty">
                        <p>No hay platos visibles todavia.</p>
                    </div>
                ) : (
                    <div className="platos-admin-grid">
                        {platos.map((plato) => (
                            <article key={plato.idPlato ?? plato.id} className="plato-admin-card">
                                <div>
                                    <span className="plato-admin-card__state">
                                        {plato.disponible ? "Activo" : "Desactivado"}
                                    </span>
                                    <h3>{plato.nombre}</h3>
                                    <p>{plato.descripcion}</p>
                                </div>

                                <div className="plato-admin-card__meta">
                                    <span>{plato.precio ?? "Precio pendiente"}</span>
                                    <div className="plato-admin-card__actions">
                                        <Link to={`/dashboard/plato/${plato.idPlato ?? plato.id}`} state={{ plato }}>
                                            Editar plato
                                        </Link>
                                        <button type="button" onClick={() => handleToggleDisponibilidad(plato)}>
                                            {plato.disponible ? "Desactivar plato" : "Activar plato"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}
