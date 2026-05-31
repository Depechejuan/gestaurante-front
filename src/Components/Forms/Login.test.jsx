import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginCustomer } from "../../services/customer-account";
import sendLogin from "../../services/login";
import saveToken from "../../services/save-token";
import Login from "./Login";

vi.mock("../../services/customer-account", () => ({
    loginCustomer: vi.fn()
}));

vi.mock("../../services/customer-token-storage", () => ({
    saveCustomerToken: vi.fn()
}));

vi.mock("../../services/login", () => ({
    default: vi.fn()
}));

vi.mock("../../services/save-token", () => ({
    default: vi.fn()
}));

function unauthorizedCustomerLogin() {
    const error = new Error("Credenciales de cliente invalidas.");
    error.status = 401;
    return Promise.reject(error);
}

function renderLogin(initialEntry = "/login") {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/staff" element={<div>Staff destination</div>} />
                <Route path="/staff/online" element={<div>Staff online destination</div>} />
                <Route path="/dashboard" element={<div>Dashboard destination</div>} />
                <Route path="/pedido-online" element={<div>Customer destination</div>} />
            </Routes>
        </MemoryRouter>
    );
}

async function submitLogin() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "sergio.reparto@gestaurante.com");
    await user.type(screen.getByLabelText(/contrase/i), "Password1.");
    await user.click(screen.getByRole("button", { name: "Entrar" }));
}

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        loginCustomer.mockImplementation(unauthorizedCustomerLogin);
        sendLogin.mockResolvedValue({
            data: {
                id: "employee-1",
                token: "token-1",
                tipo: "Repartidor"
            }
        });
    });

    it("sends a repartidor to staff instead of an inaccessible dashboard redirect", async () => {
        renderLogin("/login?redirect=%2Fdashboard");

        await submitLogin();

        expect(await screen.findByText("Staff destination")).toBeInTheDocument();
        expect(saveToken).toHaveBeenCalledWith(expect.objectContaining({ tipo: "Repartidor" }));
    });

    it("preserves a valid staff redirect for a repartidor", async () => {
        renderLogin("/login?redirect=%2Fstaff%2Fonline%3Fview%3Dreparto");

        await submitLogin();

        expect(await screen.findByText("Staff online destination")).toBeInTheDocument();
    });
});
