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
        const tipo = response.data.tipo;
        if (tipo === 0) {
            navigate("/dashboard")
            return;
        }
        if (tipo === 1 || tipo === 2) {
            navigate("/staff")
            return;
        }
        setIsSubmitting(false);
        navigate("/")
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card">
                <div className="customer-auth-card__copy">
                    <p className="public-eyebrow">Acceso interno</p>
                    <h1>Entrar al panel</h1>
                    <p>
                        Acceso reservado para administracion y staff. El destino final depende
                        del rol del usuario autenticado.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth">
                    <div className="customer-form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
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
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    {error && <p className="customer-form-error">{error}</p>}

                    <button type="submit" className="customer-btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Accediendo..." : "Entrar"}
                    </button>
                </form>
            </div>
        </section>
    );
}


export default Login
