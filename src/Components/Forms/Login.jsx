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
        const response = await sendLogin(form)
        console.log(response);
        saveToken(response)
        navigate("/dashboard")
        console.log("Objeto enviado al backend:", form);
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