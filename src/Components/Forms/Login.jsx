import { useLocation, useNavigate } from "react-router-dom";
import sendLogin from "../../services/login";
import saveToken from "../../services/save-token";
import { loginCustomer } from "../../services/customer-account";
import { saveCustomerToken } from "../../services/customer-token-storage";
import { resolveEmployeeRoleName } from "../../constants/roles";
import AuthLoginForm from "./Auth-Login-Form";

const STAFF_LOGIN_ROLES = ["Camarero", "Cocinero", "Repartidor"];

function resolveEmployeeDestination(roleName, employeeRedirect) {
    if (roleName === "Administrador")
        return employeeRedirect || "/dashboard";

    if (STAFF_LOGIN_ROLES.includes(roleName)) {
        if (employeeRedirect?.startsWith("/staff"))
            return employeeRedirect;

        return "/staff";
    }

    return "/";
}

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.state?.redirectTo || new URLSearchParams(location.search).get("redirect") || "/pedido-online";
    const employeeRedirect = redirect.startsWith("/dashboard") || redirect.startsWith("/staff") ? redirect : null;

    const handleSubmit = async (form) => {
        try {
            const response = await loginCustomer(form);
            if (!response?.data)
                throw new Error("No se ha podido iniciar sesión.");

            saveCustomerToken(response.data);
            navigate(redirect);
            return;
        } catch (error) {
            if (error?.status !== 401)
                throw error;

            // Si no es una cuenta de cliente válida, probamos el acceso interno.
        }

        const response = await sendLogin(form);
        if (!response?.data)
            throw new Error("No hemos podido iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.");

        const roleName = resolveEmployeeRoleName(response.data.tipo);
        saveToken(response.data);
        navigate(resolveEmployeeDestination(roleName, employeeRedirect));
    };

    return (
        <AuthLoginForm
            eyebrow="Acceso"
            title="Entrar"
            description="Accede con tu cuenta para continuar un pedido online o entrar en tu área de trabajo."
            submitLabel="Entrar"
            loadingLabel="Entrando..."
            errorMessage="No hemos podido iniciar sesión. Revisa tus credenciales e inténtalo de nuevo."
            secondaryLink={{ to: `/cuenta/register?redirect=${encodeURIComponent(redirect)}`, label: "¿No tienes cuenta? Regístrate" }}
            forgotLink={{ to: "/recuperar-password", label: "He olvidado mi contraseña" }}
            onSubmit={handleSubmit}
        />
    );
}

export default Login;
