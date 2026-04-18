import { describe, expect, it } from "vitest";
import { extractCatalogItems } from "./public-catalog";

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
});
