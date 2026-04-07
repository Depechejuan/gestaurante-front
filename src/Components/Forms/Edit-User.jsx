import { useState } from "react"
import { resolveEmployeeRoleValue } from "../../constants/roles";
import "../../styles/Admin/users.css";

const tipoOptions = [
    { value: 0, label: 'Administrador' },
    { value: 1, label: 'Camarero' },
    { value: 2, label: 'Cocinero' },
];

export default function EditUser({user}) {
    const [userEdit, setUserEdit] = useState({
        nombre: user.nombre ?? "",
        apellido1: user.apellido1 ?? "",
        apellido2: user.apellido2 ?? "",
        dni: user.dni ?? "",
        nuss: user.nuss ?? "",
        email: user.email ?? "",
        password: "",
        tipo: Number(resolveEmployeeRoleValue(user.tipo) ?? 0)
    })
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dniRegex = /^\d{8}-[A-Z]$/;
    const nussRegex = /^\d{2}-\d{8}-\d$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsSubmitted(false);
        setUserEdit({
            ...userEdit,
            [name]: name === "tipo" ? Number(value) : value
        });
    }

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate())
            return;
        console.log("Enviar:", userEdit);
        setIsSubmitted(true);
    };


    const validate = () => {
        const newErrors = {};

        if (!dniRegex.test(userEdit.dni))
            newErrors.dni = "Formato DNI inválido (12345678-A)";

        if (!nussRegex.test(userEdit.nuss))
            newErrors.nuss = "Formato NUSS inválido (28-12345678-5)";

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
                    </section>
                </div>

                <div className="form-actions">
                    <div className="form-status">
                        {isSubmitted && <span>Cambios preparados correctamente.</span>}
                    </div>
                    <button type="submit" className="submit-button">Guardar cambios</button>
                </div>
            </form>
        </section>
    )
}
