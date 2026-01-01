import React, { useState } from 'react';

const tipoOptions = [
    { value: 0, label: 'Administrador' },
    { value: 1, label: 'Camarero' },
    { value: 2, label: 'Cocinero' },
];

const Register = () => {
    const [formData, setFormData] = useState({
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'tipo') {
            setFormData({
                ...formData,
                [name]: parseInt(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        // Validación de contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
        }

        // Validación de nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        }

        // Validación de apellidos
        if (!formData.firstLastName.trim()) {
            newErrors.firstLastName = 'El primer apellido es obligatorio';
        }

        // Validación de DNI (formato español simple)
        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es obligatorio';
        } else if (!/^\d{8}-[A-Z]$/.test(formData.dni)) {
            newErrors.dni = 'Formato de DNI inválido (ej: 48620440-G)';
        }

        // Validación de NUSS (formato español de número de la seguridad social)
        if (!formData.nuss.trim()) {
            newErrors.nuss = 'El NUSS es obligatorio';
        } else if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.nuss)) {
            newErrors.nuss = 'Formato NUSS inválido (ej: 28-12345678-5)';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Datos del formulario:', formData);
            alert('Registro enviado correctamente');
            
            setFormData({
                email: '',
                password: '',
                firstName: '',
                firstLastName: '',
                secondLastName: '',
                dni: '',
                nuss: '',
                tipo: 0,
            });
        }
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
                        value={formData.email}
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
                        value={formData.password}
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
                        value={formData.firstName}
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
                        value={formData.firstLastName}
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
                        value={formData.secondLastName}
                        onChange={handleChange}
                        placeholder="García"
                    />

                    <label htmlFor="dni">DNI *</label>
                    <input
                        type="text"
                        id="dni"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        placeholder="48620440-G"
                        className={errors.dni ? 'error' : ''}
                    />
                    {errors.dni && <span className="error-message">{errors.dni}</span>}

                    <label htmlFor="nuss">Número de Seguridad Social (NUSS) *</label>
                    <input
                        type="text"
                        id="nuss"
                        name="nuss"
                        value={formData.nuss}
                        onChange={handleChange}
                        placeholder="28-12345678-5"
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
                    value={formData.tipo}
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