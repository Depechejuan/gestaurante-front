import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import usePlatos from "./usePlatos";
import { server } from "../test/msw/server";

function HookHarness() {
    const { platos, loading, error } = usePlatos();

    if (loading)
        return <p>Cargando...</p>;

    if (error)
        return <p>{error}</p>;

    return (
        <ul>
            {platos.map((plato) => (
                <li key={plato.idPlato}>{plato.nombre}</li>
            ))}
        </ul>
    );
}

describe("usePlatos", () => {
    it("loads every dish returned by the public catalog endpoint", async () => {
        server.use(
            http.get(/\/public\/catalogo$/, () =>
                HttpResponse.json({
                    status: 200,
                    data: [
                        { idPlato: "plato-1", nombre: "Ensalada Caprese" },
                        { idPlato: "plato-2", nombre: "Pizza Margarita" },
                        { idPlato: "plato-3", nombre: "Tiramisu" }
                    ]
                })
            )
        );

        render(<HookHarness />);

        expect(await screen.findByText("Ensalada Caprese")).toBeInTheDocument();
        expect(screen.getByText("Pizza Margarita")).toBeInTheDocument();
        expect(screen.getByText("Tiramisu")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("surfaces API errors as a user-friendly message", async () => {
        server.use(
            http.get(/\/public\/catalogo$/, () =>
                HttpResponse.json(
                    {
                        status: 500,
                        error: "Catalogo temporalmente no disponible."
                    },
                    { status: 500 }
                )
            )
        );

        render(<HookHarness />);

        expect(await screen.findByText("Catalogo temporalmente no disponible.")).toBeInTheDocument();
    });
});
