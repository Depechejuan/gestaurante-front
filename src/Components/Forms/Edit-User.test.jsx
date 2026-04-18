import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EditUser from "./Edit-User";

const mocks = vi.hoisted(() => ({
    updateEmpleado: vi.fn()
}));

vi.mock("../../services/get-token", () => ({
    default: () => ({ token: "employee-token", id: "empleado-1" })
}));

vi.mock("../../services/empleados", () => ({
    updateEmpleado: mocks.updateEmpleado
}));

const baseUser = {
    id: "8b2697f0-aab0-45b3-8e82-e0016d02a3f1",
    nombre: "Lucas",
    apellido1: "Romero",
    apellido2: "Pruebas",
    dni: "12345678Z",
    nuss: "28-1234567890-5",
    email: "lucas.romero@gestaurante.com",
    tipo: "Camarero",
    activo: true
};

describe("EditUser", () => {
    it("re-syncs the form state when the selected employee changes", async () => {
        const { rerender } = render(<EditUser user={baseUser} onSaved={vi.fn()} />);

        expect(screen.getByLabelText("Nombre")).toHaveValue("Lucas");

        const nextUser = {
            ...baseUser,
            id: "2e8968fd-8f97-49bd-98a2-4ecf1242278b",
            nombre: "Sergio",
            apellido1: "Reparto",
            email: "sergio.reparto@gestaurante.com",
            tipo: "Repartidor"
        };

        rerender(<EditUser user={nextUser} onSaved={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByLabelText("Nombre")).toHaveValue("Sergio");
            expect(screen.getByLabelText("Email")).toHaveValue("sergio.reparto@gestaurante.com");
        });
    });

    it("submits the canonical employee payload and propagates the saved user", async () => {
        const onSaved = vi.fn();
        const user = userEvent.setup();
        const updatedUser = {
            ...baseUser,
            nombre: "Lucas Editado",
            email: "lucas.editado@gestaurante.com",
            tipo: "Repartidor"
        };

        mocks.updateEmpleado.mockResolvedValueOnce({ data: updatedUser });

        render(<EditUser user={baseUser} onSaved={onSaved} />);

        await user.clear(screen.getByLabelText("Nombre"));
        await user.type(screen.getByLabelText("Nombre"), "Lucas Editado");
        await user.clear(screen.getByLabelText("Email"));
        await user.type(screen.getByLabelText("Email"), "lucas.editado@gestaurante.com");
        await user.selectOptions(screen.getByLabelText("Puesto"), "3");
        await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

        await waitFor(() => {
            expect(mocks.updateEmpleado).toHaveBeenCalledWith(
                baseUser.id,
                expect.objectContaining({
                    Nombre: "Lucas Editado",
                    Apellido1: "Romero",
                    Apellido2: "Pruebas",
                    Email: "lucas.editado@gestaurante.com",
                    DNI: "12345678-Z",
                    NUSS: "28-1234567890-5",
                    Tipo: 3,
                    Activo: true
                }),
                { token: "employee-token", id: "empleado-1" }
            );
        });

        expect(onSaved).toHaveBeenCalledWith(updatedUser);
        expect(await screen.findByText("Empleado actualizado correctamente.")).toBeInTheDocument();
    });
});
