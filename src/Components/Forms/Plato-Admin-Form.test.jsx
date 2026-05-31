import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PlatoAdminForm from "./Plato-Admin-Form";

describe("PlatoAdminForm", () => {
    it("shows existing categories as suggestions while keeping the field editable", async () => {
        render(
            <PlatoAdminForm
                mode="create"
                categorias={[
                    { idCategoria: 1, descripcion: "Entrantes" },
                    { idCategoria: 2, descripcion: "Pizzas" },
                    { idCategoria: 3, descripcion: "Postres" }
                ]}
            />
        );

        const categoriaInput = screen.getByLabelText("Categoria");
        expect(categoriaInput).toHaveAttribute("list", "plato-categoria-suggestions-create");
        const suggestionOptions = Array.from(
            document.querySelectorAll("#plato-categoria-suggestions-create option")
        ).map((option) => option.getAttribute("value"));

        expect(suggestionOptions).toEqual(["Entrantes", "Pizzas", "Postres"]);
        expect(screen.getByText("Puedes elegir una categoria existente o escribir una nueva.")).toBeInTheDocument();
    });

    it("submits a custom category even when suggestions exist", async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <PlatoAdminForm
                mode="create"
                categorias={[
                    { idCategoria: 1, descripcion: "Entrantes" },
                    { idCategoria: 2, descripcion: "Pizzas" }
                ]}
                onSubmit={onSubmit}
            />
        );

        await user.type(screen.getByLabelText("Nombre del plato"), "Pizza blanca");
        await user.type(screen.getByLabelText("Descripcion"), "Mozzarella, pera y nueces");
        await user.type(screen.getByLabelText("Categoria"), "Pizza");
        await user.click(screen.getByRole("button", { name: "Crear plato" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    nombre: "Pizza blanca",
                    descripcion: "Mozzarella, pera y nueces",
                    categoria: "Pizza"
                }),
                expect.objectContaining({
                    setErrors: expect.any(Function)
                })
            );
        });
    });

    it("allows comma decimal prices", async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();

        render(<PlatoAdminForm mode="create" onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText("Nombre del plato"), "Cafe Americano");
        await user.type(screen.getByLabelText("Descripcion"), "Cafe no aprobado por Italia");
        await user.type(screen.getByLabelText("Precio"), "2,50");
        await user.type(screen.getByLabelText("Categoria"), "Cafes");
        await user.click(screen.getByRole("button", { name: "Crear plato" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    precio: "2,50"
                }),
                expect.objectContaining({
                    setErrors: expect.any(Function)
                })
            );
        });
    });
});
