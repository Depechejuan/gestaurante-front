import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import App from "./App";

const authState = vi.hoisted(() => ({
    user: null,
    loading: false,
    roleName: null,
    hasToken: false
}));

const customerAuthState = vi.hoisted(() => ({
    customer: null,
    loading: false
}));

function createPageStub(label) {
    return {
        default: () => <div>{label}</div>
    };
}

vi.mock("./Auth/Auth-Context", () => ({
    useAuth: () => authState
}));

vi.mock("./Auth/Customer-Auth-Context", () => ({
    useCustomerAuth: () => customerAuthState
}));

vi.mock("./Layouts/Layout-Clientes", async () => {
    const { Outlet } = await vi.importActual("react-router-dom");
    return {
        default: () => (
            <div>
                <div>LayoutCliente</div>
                <Outlet />
            </div>
        )
    };
});

vi.mock("./Layouts/Layout-Staff", async () => {
    const { Outlet } = await vi.importActual("react-router-dom");
    return {
        default: () => (
            <div>
                <div>LayoutStaff</div>
                <Outlet />
            </div>
        )
    };
});

vi.mock("./Layouts/Layout-Admin", async () => {
    const { Outlet } = await vi.importActual("react-router-dom");
    return {
        default: () => (
            <div>
                <div>LayoutAdmin</div>
                <Outlet />
            </div>
        )
    };
});

vi.mock("./Pages/Home", () => createPageStub("Page:Home"));
vi.mock("./Pages/Dashboard", () => createPageStub("Page:Dashboard"));
vi.mock("./Pages/Dashboard-Staff", () => createPageStub("Page:DashboardStaff"));
vi.mock("./Components/Forms/Login", () => createPageStub("Page:Login"));
vi.mock("./Components/Forms/Register", () => createPageStub("Page:Register"));
vi.mock("./Pages/Contact", () => createPageStub("Page:Contact"));
vi.mock("./Components/Empleados", () => createPageStub("Page:Empleados"));
vi.mock("./Components/UniqueEmpleado", () => createPageStub("Page:UniqueEmpleado"));
vi.mock("./Pages/About", () => createPageStub("Page:About"));
vi.mock("./Pages/Mesas", () => createPageStub("Page:Mesas"));
vi.mock("./Pages/MesaDetail", () => createPageStub("Page:MesaDetail"));
vi.mock("./Pages/Pedidos", () => createPageStub("Page:Pedidos"));
vi.mock("./Pages/UniquePedido", () => createPageStub("Page:UniquePedido"));
vi.mock("./Pages/Facturas", () => createPageStub("Page:Facturas"));
vi.mock("./Pages/UniqueFactura", () => createPageStub("Page:UniqueFactura"));
vi.mock("./Pages/PlatosAdmin", () => createPageStub("Page:PlatosAdmin"));
vi.mock("./Pages/UniquePlatoAdmin", () => createPageStub("Page:UniquePlatoAdmin"));
vi.mock("./Pages/PlatosPublic", () => createPageStub("Page:PlatosPublic"));
vi.mock("./Pages/UniquePlatoPublic", () => createPageStub("Page:UniquePlatoPublic"));
vi.mock("./Pages/MesaQrMenu", () => createPageStub("Page:MesaQrMenu"));
vi.mock("./Pages/CustomerRegister", () => createPageStub("Page:CustomerRegister"));
vi.mock("./Pages/CustomerVerifyEmail", () => createPageStub("Page:CustomerVerifyEmail"));
vi.mock("./Pages/CustomerConfirmEmail", () => createPageStub("Page:CustomerConfirmEmail"));
vi.mock("./Pages/PasswordRecovery", () => createPageStub("Page:PasswordRecovery"));
vi.mock("./Pages/ResetPassword", () => createPageStub("Page:ResetPassword"));
vi.mock("./Pages/OnlineOrder", () => createPageStub("Page:OnlineOrder"));
vi.mock("./Pages/CustomerAccount", () => createPageStub("Page:CustomerAccount"));
vi.mock("./Pages/CustomerOrders", () => createPageStub("Page:CustomerOrders"));
vi.mock("./Pages/CustomerAddresses", () => createPageStub("Page:CustomerAddresses"));
vi.mock("./Pages/CustomerPaymentMethods", () => createPageStub("Page:CustomerPaymentMethods"));
vi.mock("./Pages/PedidosOnline", () => createPageStub("Page:PedidosOnline"));
vi.mock("./Pages/Clientes", () => createPageStub("Page:Clientes"));
vi.mock("./Pages/UniqueCliente", () => createPageStub("Page:UniqueCliente"));

function setEmployeeSession(roleName = null) {
    authState.user = roleName ? { tipo: roleName } : null;
    authState.loading = false;
    authState.roleName = roleName;
    authState.hasToken = Boolean(roleName);
}

function setCustomerSession(isAuthenticated = false) {
    customerAuthState.loading = false;
    customerAuthState.customer = isAuthenticated ? { email: "cliente@gestaurante.com" } : null;
}

function renderRoute(path) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <App />
        </MemoryRouter>
    );
}

const publicRoutes = [
    ["/", "Page:Home"],
    ["/login", "Page:Login"],
    ["/recuperar-password", "Page:PasswordRecovery"],
    ["/restablecer-password?token=abc", "Page:ResetPassword"],
    ["/carta", "Page:PlatosPublic"],
    ["/carta/123", "Page:UniquePlatoPublic"],
    ["/mesa/12", "Page:MesaQrMenu"],
    ["/pedido-online", "Page:OnlineOrder"],
    ["/checkout", "Page:OnlineOrder"],
    ["/cuenta/register", "Page:CustomerRegister"],
    ["/cuenta/verificar-email", "Page:CustomerVerifyEmail"],
    ["/cuenta/confirmar-email?token=abc", "Page:CustomerConfirmEmail"],
    ["/cuenta/login", "Page:Login"],
    ["/about", "Page:About"],
    ["/contacto", "Page:Contact"]
];

const customerRoutes = [
    ["/cuenta", "Page:CustomerAccount"],
    ["/cuenta/pedidos", "Page:CustomerOrders"],
    ["/cuenta/direcciones", "Page:CustomerAddresses"],
    ["/cuenta/metodos-pago", "Page:CustomerPaymentMethods"]
];

const protectedRoutes = [
    ["/staff", "Page:DashboardStaff"],
    ["/staff/mesas", "Page:Mesas"],
    ["/staff/mesas/1", "Page:MesaDetail"],
    ["/staff/pedidos", "Page:Pedidos"],
    ["/staff/pedidos/1", "Page:UniquePedido"],
    ["/staff/online", "Page:PedidosOnline"],
    ["/staff/entregas", "Page:PedidosOnline"],
    ["/staff/reparto", "Page:PedidosOnline"],
    ["/staff/facturas", "Page:Facturas"],
    ["/staff/facturas/1", "Page:UniqueFactura"],
    ["/staff/clientes", "Page:Clientes"],
    ["/staff/clientes/1", "Page:UniqueCliente"],
    ["/dashboard", "Page:Dashboard"],
    ["/dashboard/register", "Page:Register"],
    ["/dashboard/empleados", "Page:Empleados"],
    ["/dashboard/empleados/1", "Page:UniqueEmpleado"],
    ["/dashboard/facturas", "Page:Facturas"],
    ["/dashboard/facturas/1", "Page:UniqueFactura"],
    ["/dashboard/clientes", "Page:Clientes"],
    ["/dashboard/clientes/1", "Page:UniqueCliente"],
    ["/dashboard/mesas", "Page:Mesas"],
    ["/dashboard/mesas/1", "Page:MesaDetail"],
    ["/dashboard/carta", "Page:PlatosAdmin"],
    ["/dashboard/plato/1", "Page:UniquePlatoAdmin"]
];

describe("App routes", () => {
    beforeEach(() => {
        setEmployeeSession(null);
        setCustomerSession(false);
    });

    test.each(publicRoutes)("renders public route %s", async (path, expectedLabel) => {
        renderRoute(path);

        expect(await screen.findByText(expectedLabel)).toBeInTheDocument();
    });

    test.each(customerRoutes)("renders customer route %s for authenticated customers", async (path, expectedLabel) => {
        setCustomerSession(true);

        renderRoute(path);

        expect(await screen.findByText(expectedLabel)).toBeInTheDocument();
    });

    test.each(protectedRoutes)("renders protected route %s for administrators", async (path, expectedLabel) => {
        setEmployeeSession("Administrador");

        renderRoute(path);

        expect(await screen.findByText(expectedLabel)).toBeInTheDocument();
    });

    it("redirects unauthenticated admin access to the login screen", async () => {
        renderRoute("/dashboard");

        expect(await screen.findByText("Page:Login")).toBeInTheDocument();
    });

    it("redirects unauthenticated customer account access to the login screen", async () => {
        renderRoute("/cuenta");

        expect(await screen.findByText("Page:Login")).toBeInTheDocument();
    });

    it("redirects non-admin employees away from the admin area", async () => {
        setEmployeeSession("Camarero");

        renderRoute("/dashboard");

        expect(await screen.findByText("Page:Home")).toBeInTheDocument();
    });
});
