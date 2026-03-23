import { useState } from 'react';
import register from '../../services/register';
import getToken from '../../services/get-token';
import '../../styles/Admin/users.css';

const tipoOptions = [
    { value: 0, label: 'Administrador' },
    { value: 1, label: 'Camarero' },
    { value: 2, label: 'Cocinero' },
];

function Register() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        firstLastName: '',
        secondLastName: '',
        dni: '',
        nuss: '',
        tipo: 0,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dniRegex = /^\d{8}-[A-Z]$/;
    const nussRegex = /^\d{2}-\d{8}-\d$/;
    const token = getToken();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsSubmitted(false);
        setForm({
        ...form,
        [name]: name === "tipo" ? Number(value) : value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "El email es obligatorio";
        }

        if (!form.password.trim()) {
            newErrors.password = "La contraseña es obligatoria";
        }

        if (!form.firstName.trim()) {
            newErrors.firstName = "El nombre es obligatorio";
        }

        if (!form.firstLastName.trim()) {
            newErrors.firstLastName = "El primer apellido es obligatorio";
        }

        if (!dniRegex.test(form.dni)) {
        newErrors.dni = "Formato DNI inválido (12345678-A)";
        }

        if (!nussRegex.test(form.nuss)) {
        newErrors.nuss = "Formato NUSS inválido (28-12345678-5)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await register(form, token)
        setIsSubmitted(true);
    };

    return (
        <section className="user-form-shell">
            <div className="user-form-heading">
                <div>
                    <p className="users-eyebrow">Alta de personal</p>
                    <h1>Registro de usuario</h1>
                    <p>Da de alta nuevos perfiles internos con un formulario mas claro y legible.</p>
                </div>
                <div className="user-form-badge">Administrador</div>
            </div>

            <form onSubmit={handleSubmit} className="user-form-card">
                <div className="user-form-grid">
                    <section className="form-group form-group--panel">
                        <h2>Datos de acceso</h2>
                        <p className="form-group__intro">Credenciales iniciales para iniciar sesion.</p>

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ejemplo@gestaurante.com"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}

                        <label htmlFor="password">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </section>

                    <section className="form-group form-group--panel">
                        <h2>Datos personales</h2>
                        <p className="form-group__intro">Informacion principal de la ficha del empleado.</p>

                        <label htmlFor="firstName">Nombre *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Juan"
                            className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}

                        <label htmlFor="firstLastName">Primer Apellido *</label>
                        <input
                            type="text"
                            id="firstLastName"
                            name="firstLastName"
                            value={form.firstLastName}
                            onChange={handleChange}
                            placeholder="Pérez"
                            className={errors.firstLastName ? 'error' : ''}
                        />
                        {errors.firstLastName && <span className="error-message">{errors.firstLastName}</span>}

                        <label htmlFor="secondLastName">Segundo Apellido</label>
                        <input
                            type="text"
                            id="secondLastName"
                            name="secondLastName"
                            value={form.secondLastName}
                            onChange={handleChange}
                            placeholder="García"
                        />

                        <label htmlFor="dni">DNI *</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={form.dni}
                            onChange={handleChange}
                            placeholder="12345678-A"
                            className={errors.dni ? 'error' : ''}
                        />
                        {errors.dni && <span className="error-message">{errors.dni}</span>}

                        <label htmlFor="nuss">Número de Seguridad Social (NUSS) *</label>
                        <input
                            type="text"
                            id="nuss"
                            name="nuss"
                            value={form.nuss}
                            onChange={handleChange}
                            placeholder="12-12345678-1"
                            className={errors.nuss ? 'error' : ''}
                        />
                        {errors.nuss && <span className="error-message">{errors.nuss}</span>}
                    </section>

                    <section className="form-group form-group--panel form-group--compact">
                        <h2>Puesto de trabajo</h2>
                        <p className="form-group__intro">Define los permisos base del nuevo usuario.</p>

                        <label htmlFor="tipo">Tipo de Usuario *</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                        >
                            {tipoOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                            ))}
                        </select>
                    </section>
                </div>

                <div className="form-actions">
                    <div className="form-status">
                        {isSubmitted && <span>Usuario enviado correctamente.</span>}
                    </div>
                    <button type="submit" className="submit-button">
                        Registrar usuario
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Register;
