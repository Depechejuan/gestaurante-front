import { useState } from "react"
import getToken from "../../services/get-token";
import { updateEmpleado } from "../../services/empleados";
import { resolveEmployeeRoleValue } from "../../constants/roles";
import { formatDni, formatNuss } from "../../utils/identity";
import "../../styles/Admin/users.css";

const tipoOptions = [
    { value: 0, label: 'Administrador' },
    { value: 1, label: 'Camarero' },
    { value: 2, label: 'Cocinero' },
    { value: 3, label: 'Repartidor' },
];

export default function EditUser({user, onSaved}) {
    const token = getToken();
    const [userEdit, setUserEdit] = useState({
        nombre: user.nombre ?? "",
        apellido1: user.apellido1 ?? "",
        apellido2: user.apellido2 ?? "",
        dni: formatDni(user.dni ?? ""),
        nuss: formatNuss(user.nuss ?? ""),
        email: user.email ?? "",
        password: "",
        tipo: Number(resolveEmployeeRoleValue(user.tipo) ?? 0),
        activo: Boolean(user.activo),
        photo: null
    })
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const dniRegex = /^\d{8}-?[A-Z]$/;
    const nussRegex = /^\d{2}-?\d{10}-?\d$/;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFeedback("");
        setUserEdit({
            ...userEdit,
            [name]: name === "tipo" ? Number(value) : name === "photo" ? files?.[0] ?? null : value
        });
    }

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;

        setSubmitting(true);
        setFeedback("");
        try {
            const response = await updateEmpleado(user.id, {
                Nombre: userEdit.nombre,
                Apellido1: userEdit.apellido1,
                Apellido2: userEdit.apellido2,
                Email: userEdit.email,
                DNI: userEdit.dni.trim().toUpperCase(),
                NUSS: userEdit.nuss.trim(),
                Password: userEdit.password,
                Tipo: userEdit.tipo,
                Activo: userEdit.activo,
                Photo: userEdit.photo
            }, token);

            onSaved?.(response?.data ?? null);
            setFeedback("Empleado actualizado correctamente.");
        } catch (err) {
            setErrors((current) => ({ ...current, submit: err.message || "No se ha podido actualizar el empleado." }));
        } finally {
            setSubmitting(false);
        }
    };


    const validate = () => {
        const newErrors = {};

        if (!dniRegex.test(userEdit.dni.replace(/\s+/g, "")))
            newErrors.dni = "Formato DNI inválido (12345678-A)";

        if (!nussRegex.test(userEdit.nuss.replace(/\s+/g, "")))
            newErrors.nuss = "Formato NUSS inválido (0111111111111 o 01-1111111111-1)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return(
        <section className="user-form-shell user-form-shell--edit">
            <div className="user-form-heading">
                <div>
                    <p className="users-eyebrow">Edicion</p>
                    <h3>Actualizar ficha de usuario</h3>
                    <p>Refina los datos visibles del empleado manteniendo una lectura limpia.</p>
                </div>
                <div className="user-form-badge">Ficha activa</div>
            </div>

            <form className="user-form-card" onSubmit={handleSubmit}>
                <div className="user-form-grid">
                    <section className="form-group form-group--panel">
                        <h2>Datos personales</h2>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={userEdit.nombre}
                            onChange={handleChange}
                        />

                        <label htmlFor="apellido1">Primer apellido</label>
                        <input
                            id="apellido1"
                            name="apellido1"
                            onChange={handleChange}
                            value={userEdit.apellido1}
                        />

                        <label htmlFor="apellido2">Segundo apellido</label>
                        <input
                            id="apellido2"
                            value={userEdit.apellido2}
                            name="apellido2"
                            onChange={handleChange}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={userEdit.email}
                            name="email"
                            onChange={handleChange}
                        />
                    </section>

                    <section className="form-group form-group--panel">
                        <h2>Documentacion y permisos</h2>
                        <label htmlFor="dni">DNI</label>
                        <input
                            id="dni"
                            value={userEdit.dni}
                            name="dni"
                            className={errors.dni ? 'error' : ''}
                            onChange={handleChange}
                        />
                        {errors.dni && <span className="error-message">{errors.dni}</span>}

                        <label htmlFor="nuss">NUSS</label>
                        <input
                            id="nuss"
                            value={userEdit.nuss}
                            name="nuss"
                            className={errors.nuss ? 'error' : ''}
                            onChange={handleChange}
                        />
                        {errors.nuss && <span className="error-message">{errors.nuss}</span>}

                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={userEdit.password}
                            onChange={handleChange}
                            placeholder="Dejar vacio si no cambia"
                        />

                        <label htmlFor="tipo">Puesto</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={userEdit.tipo}
                            onChange={handleChange}
                        >
                            {tipoOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="photo">Foto</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </section>
                </div>

                <div className="form-actions">
                    <div className="form-status">
                        {feedback && <span>{feedback}</span>}
                        {errors.submit && <span className="error-message">{errors.submit}</span>}
                    </div>
                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>
        </section>
    )
}
