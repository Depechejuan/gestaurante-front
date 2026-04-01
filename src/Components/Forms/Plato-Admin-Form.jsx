import { useEffect, useState } from "react";
import "../../styles/Admin/platos.css";

const defaultForm = {
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: "",
    disponible: true,
    categoria: "",
    ingredientes: "",
    menuNotes: "",
    tags: ""
};

function normalizeIngredientsInput(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => item?.nombre ?? item)
            .filter(Boolean)
            .join(", ");
    }

    return value ?? "";
}

function normalizeInitialValues(initialValues) {
    return {
        ...defaultForm,
        ...initialValues,
        ingredientes: normalizeIngredientsInput(initialValues?.ingredientes)
    };
}

export default function PlatoAdminForm({ mode = "create", initialValues = {}, onSubmit, busy = false, submitLabel }) {
    const [form, setForm] = useState({ ...defaultForm, ...initialValues });
    const [errors, setErrors] = useState({});

    const isEdit = mode === "edit";

    const initialValuesKey = JSON.stringify({
        nombre: initialValues?.nombre ?? "",
        descripcion: initialValues?.descripcion ?? "",
        imagen: initialValues?.imagen ?? "",
        precio: initialValues?.precio ?? "",
        disponible: Boolean(initialValues?.disponible),
        categoria: initialValues?.categoria ?? "",
        ingredientes: normalizeIngredientsInput(initialValues?.ingredientes),
        menuNotes: initialValues?.menuNotes ?? "",
        tags: initialValues?.tags ?? ""
    });

    useEffect(() => {
        setForm(normalizeInitialValues(initialValues));
    }, [initialValuesKey]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.nombre.trim()) {
            nextErrors.nombre = "El nombre del plato es obligatorio";
        }

        if (!form.descripcion.trim()) {
            nextErrors.descripcion = "Añade una descripcion para el plato";
        }

        if (form.precio !== "" && Number(form.precio) < 0) {
            nextErrors.precio = "El precio no puede ser negativo";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;
        onSubmit?.(form, { setErrors });
    };

    return (
        <section className="plato-form-shell">
            <div className="plato-form-heading">
                <div>
                    <p className="plato-eyebrow">Carta interna</p>
                    <h2>{isEdit ? "Edicion de plato" : "Creacion de plato"}</h2>
                    <p>
                        Gestiona la carta interna desde el backoffice con los datos reales del
                        catalogo.
                    </p>
                </div>
                <div className="plato-form-badge">
                    {isEdit ? "Modo edicion" : "Modo creacion"}
                </div>
            </div>

            <form className="plato-form-card" onSubmit={handleSubmit}>
                <div className="plato-form-grid">
                    <section className="plato-form-panel">
                        <h3>Base del plato</h3>

                        <label htmlFor="nombre">Nombre del plato</label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? "error" : ""}
                            placeholder="Ej. Ravioli de setas"
                            disabled={busy}
                        />
                        {errors.nombre && <span className="error-message">{errors.nombre}</span>}

                        <label htmlFor="descripcion">Descripcion</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            className={errors.descripcion ? "error" : ""}
                            placeholder="Resumen corto para cocina, sala y carta"
                            rows="5"
                            disabled={busy}
                        />
                        {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}

                        <label htmlFor="imagen">URL de imagen</label>
                        <input
                            id="imagen"
                            name="imagen"
                            value={form.imagen}
                            onChange={handleChange}
                            placeholder="https://..."
                            disabled={busy}
                        />
                    </section>

                    <section className="plato-form-panel">
                        <h3>Comercial y disponibilidad</h3>

                        <label htmlFor="precio">Precio</label>
                        <input
                            id="precio"
                            name="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.precio}
                            onChange={handleChange}
                            className={errors.precio ? "error" : ""}
                            placeholder="0.00"
                            disabled={busy}
                        />
                        {errors.precio && <span className="error-message">{errors.precio}</span>}

                        <label htmlFor="categoria">Categoria</label>
                        <input
                            id="categoria"
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            placeholder="Entrante, principal, postre..."
                            disabled={busy}
                        />

                        <label htmlFor="tags">Etiquetas internas</label>
                        <input
                            id="tags"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="Veggie, sin gluten, temporada..."
                            disabled={busy}
                        />

                        <label className="plato-checkbox">
                            <input
                                type="checkbox"
                                name="disponible"
                                checked={form.disponible}
                                onChange={handleChange}
                                disabled={busy}
                            />
                            Disponible para publicacion
                        </label>
                    </section>

                    <section className="plato-form-panel plato-form-panel--wide">
                        <h3>Ingredientes y notas internas</h3>

                        <label htmlFor="ingredientes">Ingredientes</label>
                        <textarea
                            id="ingredientes"
                            name="ingredientes"
                            value={form.ingredientes}
                            onChange={handleChange}
                            placeholder="Separados por comas"
                            rows="4"
                            disabled={busy}
                        />

                        <label htmlFor="menuNotes">Notas de menu y reglas futuras</label>
                        <textarea
                            id="menuNotes"
                            name="menuNotes"
                            value={form.menuNotes}
                            onChange={handleChange}
                            placeholder="Ubicacion en menus, combos, restricciones o extras..."
                            rows="4"
                            disabled={busy}
                        />
                    </section>
                </div>

                <div className="plato-form-actions">
                    <div className="form-status" />
                    <button type="submit" className="submit-button" disabled={busy}>
                        {busy ? "Guardando..." : (submitLabel ?? (isEdit ? "Guardar cambios del plato" : "Crear plato"))}
                    </button>
                </div>
            </form>
        </section>
    );
}
