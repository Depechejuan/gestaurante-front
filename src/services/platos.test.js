import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/msw/server";
import { createPlato, updatePlato } from "./platos";

describe("platos service", () => {
    it("does not send an empty idPlato when creating a dish", async () => {
        let formData;
        server.use(
            http.post(/\/Plato$/, async ({ request }) => {
                formData = await request.formData();
                return HttpResponse.json({ status: 201, data: { idPlato: "dish-1" } }, { status: 201 });
            })
        );

        await createPlato({
            nombre: "Cafe Americano",
            descripcion: "Cafe con agua",
            disponible: true,
            precio: 2.5,
            idCategoria: "category-1",
            categoriaDescripcion: "Cafes",
            ingredientes: []
        }, { token: "token-1" });

        expect(formData.has("idPlato")).toBe(false);
        expect(formData.get("precio")).toBe("2.5");
    });

    it("sends idPlato when updating a dish", async () => {
        let formData;
        const dishId = "11111111-1111-1111-1111-111111111111";
        server.use(
            http.put(/\/Plato\/11111111-1111-1111-1111-111111111111$/, async ({ request }) => {
                formData = await request.formData();
                return HttpResponse.json({ status: 200, data: { idPlato: dishId } });
            })
        );

        await updatePlato(dishId, {
            idPlato: dishId,
            nombre: "Cafe Americano",
            descripcion: "Cafe con agua",
            disponible: true,
            precio: 2.5,
            idCategoria: "category-1",
            categoriaDescripcion: "Cafes",
            ingredientes: []
        }, { token: "token-1" });

        expect(formData.get("idPlato")).toBe(dishId);
    });
});
