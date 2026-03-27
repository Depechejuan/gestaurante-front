import { useNavigate } from "react-router-dom";
import sendLogin from "../../services/login";
import saveToken from "../../services/save-token";
import { loginCustomer } from "../../services/customer-account";
import { saveCustomerToken } from "../../services/customer-token-storage";
import AuthLoginForm from "./Auth-Login-Form";

function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (form) => {
        try {
            const response = await loginCustomer(form);
            if (!response?.data) {
                throw new Error("No se ha podido iniciar sesión.");
            }

            saveCustomerToken(response.data);
            navigate("/pedido-online");
            return;
        } catch {
            // Si no es una cuenta de cliente válida, probamos el acceso interno.
        }

        const response = await sendLogin(form);
        if (!response?.data) {
            throw new Error("No hemos podido iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.");
        }

        saveToken(response.data);
        const tipo = response.data.tipo;
        if (tipo === 0) {
            navigate("/dashboard");
            return;
        }
        if (tipo === 1 || tipo === 2 || tipo === 3) {
            navigate("/staff");
            return;
        }

        navigate("/");
    };

    return (
        <AuthLoginForm
            eyebrow="Acceso"
            title="Entrar"
            description="Usa el mismo formulario para acceder como cliente o como personal. La aplicación resolverá internamente el tipo de cuenta y te llevará a tu área correspondiente."
            submitLabel="Entrar"
            loadingLabel="Entrando..."
            errorMessage="No hemos podido iniciar sesión. Revisa tus credenciales e inténtalo de nuevo."
            onSubmit={handleSubmit}
        />
    );
}

export default Login;
