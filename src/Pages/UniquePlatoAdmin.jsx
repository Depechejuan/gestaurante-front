import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlatoAdminForm from "../Components/Forms/Plato-Admin-Form";
import { createCategoria, getCategorias } from "../services/categorias";
import { createIngrediente, getIngredientes } from "../services/ingredientes";
import getToken from "../services/get-token";
import { getAdminPlato, updatePlato } from "../services/platos";
import "../styles/Admin/platos.css";

function mapPlatoToForm(plato) {
    return {
        nombre: plato?.nombre ?? "",
        descripcion: plato?.descripcion ?? "",
        imagen: plato?.imagen ?? "",
        precio: plato?.precio ?? "",
        disponible: Boolean(plato?.disponible),
        categoria: plato?.categoriaDescripcion ?? "",
        ingredientes: plato?.ingredientes ?? [],
        menuNotes: "",
        tags: ""
    };
}

export default function UniquePlatoAdmin() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const token = getToken();
    const navigationPlato = location.state?.plato ?? null;
    const [plato, setPlato] = useState(mapPlatoToForm(navigationPlato));
    const [loading, setLoading] = useState(!navigationPlato);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);

    useEffect(() => {
        let ignore = false;

        const loadPlato = async () => {
            if (navigationPlato) {
                setPlato(mapPlatoToForm(navigationPlato));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getAdminPlato(id, token);
                if (!ignore)
                    setPlato(mapPlatoToForm(response?.data));
            } catch (err) {
                if (!ignore)
                    setError(err.message || "No hemos podido cargar el plato.");
            } finally {
                if (!ignore)
                    setLoading(false);
            }
        };

        loadPlato();

        return () => {
            ignore = true;
        };
    }, [id, location.key]);

    useEffect(() => {
        let ignore = false;

        const loadDependencies = async () => {
            try {
                const [categoriasResponse, ingredientesResponse] = await Promise.all([
                    getCategorias(token),
                    getIngredientes(token)
                ]);
                if (ignore)
                    return;
                setCategorias(categoriasResponse?.data ?? []);
                setIngredientes(ingredientesResponse?.data ?? []);
            } catch {
                if (!ignore)
                    setError((prev) => prev || "No hemos podido cargar categorias e ingredientes.");
            }
        };

        loadDependencies();

        return () => {
            ignore = true;
        };
    }, [id]);

    const title = useMemo(() => plato?.nombre || "Plato", [plato]);

    const resolveCategoria = async (categoriaValue) => {
        const normalized = categoriaValue.trim().toLowerCase();
        const existing = categorias.find((item) => item.descripcion?.trim().toLowerCase() === normalized);
        if (existing)
            return existing;

        const response = await createCategoria({ descripcion: categoriaValue.trim() }, token);
        const created = response?.data;
        setCategorias((prev) => [...prev, created]);
        return created;
    };

    const resolveIngredientes = async (ingredientesValue) => {
        const names = ingredientesValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const resolved = [];
        let nextIngredientes = [...ingredientes];

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

    const handleSubmit = async (formValues) => {
        setSaving(true);
        setError("");
        setFeedback("");
        try {
            const categoria = await resolveCategoria(formValues.categoria);
            const ingredientesResolved = await resolveIngredientes(formValues.ingredientes);
            await updatePlato(id, {
                idPlato: id,
                nombre: formValues.nombre,
                descripcion: formValues.descripcion,
                imagen: "",
                disponible: Boolean(formValues.disponible),
                precio: Number(formValues.precio || 0),
                idCategoria: categoria.idCategoria,
                categoriaDescripcion: categoria.descripcion,
                ingredientes: ingredientesResolved
            }, token);
            setFeedback("Plato actualizado correctamente.");
            setTimeout(() => navigate("/dashboard/carta"), 700);
        } catch (err) {
            setError(err.message || "No se ha podido actualizar el plato.");
        } finally {
            setSaving(false);
        }
    };

    return(
        <section className="platos-admin-shell">
            <div className="platos-admin-header">
                <div>
                    <p className="plato-eyebrow">Ficha de plato</p>
                    <h1>Editar {title}</h1>
                    <p>
                        Registro {id}. Desde aqui puedes actualizar los datos del plato en la carta.
                    </p>
                </div>

                <Link to="/dashboard/carta" className="platos-admin-back">
                    Volver a carta
                </Link>
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

            {loading ? (
                <div className="platos-admin-empty">
                    <p>Cargando plato...</p>
                </div>
            ) : (
                <PlatoAdminForm mode="edit" initialValues={plato} onSubmit={handleSubmit} busy={saving} />
            )}
        </section>
    )
}
