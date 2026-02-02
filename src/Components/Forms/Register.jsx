import React, { useState } from 'react';
import register from '../../services/register';
import getToken from '../../services/get-token';

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
    const dniRegex = /^\d{8}-[A-Z]$/;
    const nussRegex = /^\d{2}-\d{8}-\d$/;
    const token = getToken();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
        ...form,
        [name]: name === "tipo" ? Number(value) : value
        });
    };

    const validate = () => {
        const newErrors = {};

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
        console.log("Objeto enviado al backend:", form);
    };

    return (
        <>
            <h1>Registro de Usuario</h1>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <h2>Datos Login</h2>
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
                </div>

                {/* Nombre */}
                <div className="form-group">
                    <h2>Datos Personales</h2>
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
                </div>

                {/* Tipo de Usuario */}
                <div className="form-group">
                    <h2>Puesto de Trabajo</h2>
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
                </div>

                <div className="form-actions">
                <button type="submit" className="submit-button">
                    Registrar Usuario
                </button>
                </div>
            </form>
        </>
    );
};

export default Register;