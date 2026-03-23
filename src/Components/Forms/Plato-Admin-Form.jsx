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

export default function PlatoAdminForm({ mode = "create", initialValues = {} }) {
    const [form, setForm] = useState({ ...defaultForm, ...initialValues });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialValues.imagen || "");
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isEdit = mode === "edit";

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setIsSubmitted(false);
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageFileChange = (event) => {
        const nextFile = event.target.files?.[0] ?? null;
        setIsSubmitted(false);
        setImageFile(nextFile);

        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        if (nextFile) {
            const previewUrl = URL.createObjectURL(nextFile);
            setImagePreview(previewUrl);
            return;
        }

        setImagePreview(initialValues.imagen || "");
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.nombre.trim()) {
            nextErrors.nombre = "El nombre provisional del plato es obligatorio";
        }

        if (!form.descripcion.trim()) {
            nextErrors.descripcion = "Añade una descripcion base para orientar el diseño";
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
        setIsSubmitted(true);
    };

    return (
        <section className="plato-form-shell">
            <div className="plato-warning">
                <strong>INCOMPLETO</strong>
                <p>
                    Este formulario es una base visual y funcional provisional. La estructura
                    final de platos, menus, ingredientes y relaciones todavia no esta cerrada.
                </p>
            </div>

            <div className="plato-form-heading">
                <div>
                    <p className="plato-eyebrow">Carta interna</p>
                    <h2>{isEdit ? "Edicion de plato" : "Creacion de plato"}</h2>
                    <p>
                        Sirve para explorar la experiencia de backoffice mientras se define el
                        modelo real del producto.
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

                        <label htmlFor="nombre">Nombre provisional</label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? "error" : ""}
                            placeholder="Ej. Ravioli de setas"
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
                        />
                        {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}

                        <label htmlFor="imagen">Imagen del plato</label>
                        <input
                            id="imagen"
                            name="imagen"
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                        />
                        <small>
                            Selecciona una imagen desde tu ordenador. Ya no es necesario pegar URL.
                        </small>
                        {imageFile && <small>Archivo seleccionado: {imageFile.name}</small>}
                        {imagePreview && (
                            <figure className="plato-media">
                                <img src={imagePreview} alt="Vista previa del plato" className="plato-pic" />
                            </figure>
                        )}
                    </section>

                    <section className="plato-form-panel">
                        <h3>Comercial y disponibilidad</h3>

                        <label htmlFor="precio">Precio orientativo</label>
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
                        />
                        {errors.precio && <span className="error-message">{errors.precio}</span>}

                        <label htmlFor="categoria">Categoria provisional</label>
                        <input
                            id="categoria"
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            placeholder="Entrante, principal, postre..."
                        />

                        <label htmlFor="tags">Etiquetas internas</label>
                        <input
                            id="tags"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="Veggie, sin gluten, temporada..."
                        />

                        <label className="plato-checkbox">
                            <input
                                type="checkbox"
                                name="disponible"
                                checked={form.disponible}
                                onChange={handleChange}
                            />
                            Disponible para publicacion
                        </label>
                    </section>

                    <section className="plato-form-panel plato-form-panel--wide">
                        <h3>Campos todavia abiertos</h3>

                        <label htmlFor="ingredientes">Ingredientes provisionales</label>
                        <textarea
                            id="ingredientes"
                            name="ingredientes"
                            value={form.ingredientes}
                            onChange={handleChange}
                            placeholder="Separados por comas o notas libres mientras no exista la relacion final"
                            rows="4"
                        />

                        <label htmlFor="menuNotes">Notas de menu y reglas futuras</label>
                        <textarea
                            id="menuNotes"
                            name="menuNotes"
                            value={form.menuNotes}
                            onChange={handleChange}
                            placeholder="Ubicacion en menus, combos, restricciones, extras..."
                            rows="4"
                        />
                    </section>
                </div>

                <div className="plato-form-actions">
                    <div className="form-status">
                        {isSubmitted && (
                            <span>
                                Borrador validado. Aun no se envia al backend porque el flujo sigue incompleto.
                            </span>
                        )}
                    </div>
                    <button type="submit" className="submit-button">
                        {isEdit ? "Guardar borrador de cambios" : "Crear borrador de plato"}
                    </button>
                </div>
            </form>
        </section>
    );
}
