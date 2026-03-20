import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sendLogin from "../../services/login";
import saveToken from "../../services/save-token";
import "../../styles/Customer/form.css";


function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setForm({
        ...form,
        [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        const response = await sendLogin(form);
        if (!response?.data) {
            setError("No hemos podido iniciar sesion. Revisa tus credenciales e intentalo de nuevo.");
            setIsSubmitting(false);
            return;
        }

        saveToken(response.data);
        setIsSubmitting(false);
        navigate("/dashboard")
    };

    return (
        <section className="login-shell">
            <div className="login-card">
                <div className="login-card__copy">
                    <p className="login-card__eyebrow">Acceso interno</p>
                    <h1>Inicia sesion</h1>
                    <p>
                        Accede al panel de gestion con tu usuario interno para continuar con la
                        operativa diaria del restaurante.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form login-form">
                    <div className="customer-form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="customer-form-group">
                        <label htmlFor="login-password">Contraseña</label>
                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>

                    {error && <p className="login-form__error">{error}</p>}

                    <button type="submit" className="customer-btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Entrando..." : "Entrar al panel"}
                    </button>
                </form>
            </div>
        </section>
    );
}


export default Login
