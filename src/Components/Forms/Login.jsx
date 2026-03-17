import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sendLogin from "../../services/login";
import saveToken from "../../services/save-token";


function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await sendLogin(form);
        if (!response?.data) return;

        saveToken(response.data);
        const tipo = response.data.tipo;
        if (tipo === 0)
            navigate("/dashboard")
        else if (tipo === 1 || tipo === 2)
            navigate("/staff")
        else
            navigate("/")
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />

            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
            />

            <button type="submit">Login</button>
        </form>
    );
}


export default Login
