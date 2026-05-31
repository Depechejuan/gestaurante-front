import { describe, expect, it } from "vitest";
import { extractCatalogItems } from "./public-catalog";
import { repairMojibake } from "../utils/text-encoding";

describe("extractCatalogItems", () => {
    it("returns a direct array response unchanged", () => {
        const catalog = [{ idPlato: "1" }, { idPlato: "2" }, { idPlato: "3" }];

        expect(extractCatalogItems(catalog)).toEqual(catalog);
    });

    it("unwraps envelope responses with a data array", () => {
        const catalog = [{ idPlato: "1" }, { idPlato: "2" }];

        expect(extractCatalogItems({ status: 200, data: catalog })).toEqual(catalog);
    });

    it("returns an empty array for unsupported payloads", () => {
        expect(extractCatalogItems(null)).toEqual([]);
        expect(extractCatalogItems({ data: null })).toEqual([]);
        expect(extractCatalogItems({ items: {} })).toEqual([]);
    });

    it("repairs mojibake text received from the catalog api", () => {
        const catalog = [{
            idPlato: "1",
            nombre: "Croquetas de jamÃ³n",
            descripcion: "Entrante ideal para acompaÃ±ar.",
            ingredientes: [{ nombre: "JamÃ³n" }]
        }];

        expect(extractCatalogItems({ status: 200, data: catalog })).toEqual([{
            idPlato: "1",
            nombre: "Croquetas de jamón",
            descripcion: "Entrante ideal para acompañar.",
            ingredientes: [{ nombre: "Jamón" }]
        }]);
    });
});

describe("repairMojibake", () => {
    it("repairs common utf-8 text interpreted as windows-1252", () => {
        expect(repairMojibake("TARTA DE QUESO DE TURRÃ“N")).toBe("TARTA DE QUESO DE TURRÓN");
        expect(repairMojibake("azÃºcar glas Â· caÃ±a")).toBe("azúcar glas · caña");
    });
});
