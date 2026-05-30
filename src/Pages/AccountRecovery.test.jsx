import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/msw/server";
import PasswordRecovery from "./PasswordRecovery";
import ResetPassword from "./ResetPassword";
import CustomerConfirmEmail from "./CustomerConfirmEmail";

describe("account recovery pages", () => {
    it("requests a password reset link and shows the generic feedback", async () => {
        const user = userEvent.setup();
        let requestedEmail = "";

        server.use(
            http.post(/\/auth\/forgot-password$/, async ({ request }) => {
                const body = await request.json();
                requestedEmail = body.email;
                return HttpResponse.json({ status: 200, data: { sent: true } });
            })
        );

        render(
            <MemoryRouter>
                <PasswordRecovery />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText("Email"), "ana@cliente.com");
        await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

        expect(await screen.findByText(/recibirás un enlace/i)).toBeInTheDocument();
        expect(requestedEmail).toBe("ana@cliente.com");
    });

    it("requires matching passwords before submitting a reset", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={["/restablecer-password?token=token-1"]}>
                <ResetPassword />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText("Contraseña"), "Password1.");
        await user.type(screen.getByLabelText("Repite la contraseña"), "Password2.");
        await user.click(screen.getByRole("button", { name: "Cambiar contraseña" }));

        expect(await screen.findByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    });

    it("submits a valid password reset token", async () => {
        const user = userEvent.setup();
        let submittedToken = "";

        server.use(
            http.post(/\/auth\/reset-password$/, async ({ request }) => {
                const body = await request.json();
                submittedToken = body.token;
                return HttpResponse.json({ status: 200, data: { reset: true } });
            })
        );

        render(
            <MemoryRouter initialEntries={["/restablecer-password?token=token-1"]}>
                <ResetPassword />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText("Contraseña"), "Password1.");
        await user.type(screen.getByLabelText("Repite la contraseña"), "Password1.");
        await user.click(screen.getByRole("button", { name: "Cambiar contraseña" }));

        expect(await screen.findByText(/Contraseña actualizada correctamente/i)).toBeInTheDocument();
        expect(submittedToken).toBe("token-1");
    });

    it("confirms customer email automatically from the link token", async () => {
        let submittedToken = "";

        server.use(
            http.post(/\/public\/account\/confirm-email$/, async ({ request }) => {
                const body = await request.json();
                submittedToken = body.token;
                return HttpResponse.json({ status: 200, data: { verified: true } });
            })
        );

        render(
            <MemoryRouter initialEntries={["/cuenta/confirmar-email?token=confirm-1"]}>
                <CustomerConfirmEmail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(submittedToken).toBe("confirm-1");
        });
        expect(await screen.findByText(/Cuenta activada correctamente/i)).toBeInTheDocument();
    });
});
