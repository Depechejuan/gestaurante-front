import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlatoAdminForm from "../Components/Forms/Plato-Admin-Form";
import { useAppDialog } from "../Context/AppDialogContext";
import { createCategoria, getCategorias } from "../services/categorias";
import { createIngrediente, getIngredientes } from "../services/ingredientes";
import { createPlato, deletePlato, getAdminPlatos } from "../services/platos";
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
                imagen: "",
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

    const handleDelete = async (plato) => {
        const confirmed = await confirm({
            title: "Eliminar plato",
            message: `¿Seguro que quieres eliminar el plato "${plato.nombre}"?`,
            confirmLabel: "Eliminar"
        });
        if (!confirmed)
            return;

        setError("");
        setFeedback("");
        try {
            await deletePlato(plato.idPlato ?? plato.id, token);
            setFeedback("Plato eliminado correctamente.");
            await loadPlatos();
        } catch (err) {
            setError(err.message || "No se ha podido eliminar el plato.");
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

            <PlatoAdminForm mode="create" onSubmit={handleCreate} busy={submitting} />

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
                                        {plato.disponible ? "Disponible" : "Oculto"}
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
                                        <button type="button" onClick={() => handleDelete(plato)}>
                                            Borrar plato
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
