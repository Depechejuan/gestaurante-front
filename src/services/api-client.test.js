import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/msw/server";
import { apiRequest } from "./api-client";

describe("apiRequest", () => {
    it("repairs mojibake text for dashboard payloads", async () => {
        server.use(
            http.get(/\/dashboard-payload$/, () => HttpResponse.json({
                status: 200,
                data: [{
                    nombre: "Croquetas de jamÃ³n",
                    descripcion: "Entrante para acompaÃ±ar",
                    detalles: [{ platoNombre: "TARTA DE QUESO DE TURRÃƒâ€œN" }]
                }]
            }))
        );

        await expect(apiRequest("/dashboard-payload")).resolves.toEqual({
            status: 200,
            data: [{
                nombre: "Croquetas de jamón",
                descripcion: "Entrante para acompañar",
                detalles: [{ platoNombre: "TARTA DE QUESO DE TURRÓN" }]
            }]
        });
    });

    it("uses a helpful message for non-json upload errors", async () => {
        server.use(
            http.post(/\/upload-too-large$/, () => new HttpResponse("<html>too large</html>", {
                status: 413,
                headers: {
                    "content-type": "text/html"
                }
            }))
        );

        await expect(apiRequest("/upload-too-large", { method: "POST", body: { ok: true } }))
            .rejects.toMatchObject({
                message: "El archivo es demasiado grande para subirlo. Prueba con una imagen mas ligera.",
                status: 413
            });
    });
});
