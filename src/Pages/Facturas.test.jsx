import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import Facturas from "./Facturas";
import { server } from "../test/msw/server";

vi.mock("../services/get-token", () => ({
    default: () => ({ token: "employee-token", id: "empleado-1" })
}));

vi.mock("../Hooks/useMesaLabels", () => ({
    default: () => ({
        getMesaShortLabel: () => "Mesa A1"
    })
}));

describe("Facturas page", () => {
    it("renders every invoice returned by the backend", async () => {
        let authorizationHeader = "";

        server.use(
            http.get(/\/Factura$/, ({ request }) => {
                authorizationHeader = request.headers.get("authorization") ?? "";

                return HttpResponse.json({
                    status: 200,
                    data: [
                        {
                            numeroFactura: "11111111-aaaa-bbbb-cccc-111111111111",
                            estado: "PENDIENTE",
                            totalConDescuento: 19,
                            precioTotal: 19,
                            descuento: 0,
                            pedidoIds: ["pedido-1"],
                            fechaFactura: "2026-04-18T10:00:00Z",
                            idMesa: "mesa-1",
                            idPedido: "pedido-1"
                        },
                        {
                            numeroFactura: "22222222-aaaa-bbbb-cccc-222222222222",
                            estado: "PAGADO",
                            totalConDescuento: 12.5,
                            precioTotal: 12.5,
                            descuento: 0,
                            pedidoIds: ["pedido-2"],
                            fechaFactura: "2026-04-18T11:00:00Z",
                            idMesa: null,
                            idPedido: "pedido-2"
                        }
                    ]
                });
            })
        );

        render(
            <MemoryRouter initialEntries={["/dashboard/facturas"]}>
                <Facturas />
            </MemoryRouter>
        );

        expect(await screen.findByText("Factura 11111111")).toBeInTheDocument();
        expect(screen.getByText("Factura 22222222")).toBeInTheDocument();
        expect(screen.queryByText("No hay facturas generadas todavia.")).not.toBeInTheDocument();
        expect(authorizationHeader).toBe("Bearer employee-token");
    });

    it("shows the proper empty state when the backend returns no invoices", async () => {
        server.use(
            http.get(/\/Factura$/, () =>
                HttpResponse.json({
                    status: 200,
                    data: []
                })
            )
        );

        render(
            <MemoryRouter initialEntries={["/dashboard/facturas"]}>
                <Facturas />
            </MemoryRouter>
        );

        expect(await screen.findByText("No hay facturas generadas todavia.")).toBeInTheDocument();
    });
});
