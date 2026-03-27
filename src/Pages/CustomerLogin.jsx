import { useNavigate } from "react-router-dom";
import AuthLoginForm from "../Components/Forms/Auth-Login-Form";
import { loginCustomer } from "../services/customer-account";
import { saveCustomerToken } from "../services/customer-token-storage";

export default function CustomerLogin() {
    const navigate = useNavigate();

    const handleSubmit = async (form) => {
        const response = await loginCustomer(form);
        saveCustomerToken(response.data);
        navigate("/pedido-online");
    };

    return (
        <AuthLoginForm
            eyebrow="Acceso cliente"
            title="Entra en tu cuenta"
            description="Gestiona direcciones, pagos y pedidos online desde tu área cliente."
            submitLabel="Entrar"
            loadingLabel="Entrando..."
            errorMessage="No se ha podido iniciar sesión."
            secondaryLink={{ to: "/cuenta/register", label: "Crear cuenta" }}
            onSubmit={handleSubmit}
        />
    );
}
