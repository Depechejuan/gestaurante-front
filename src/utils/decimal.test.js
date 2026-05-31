import { describe, expect, it } from "vitest";
import { parseLocalizedDecimal } from "./decimal";

describe("parseLocalizedDecimal", () => {
    it("accepts comma and dot decimal separators", () => {
        expect(parseLocalizedDecimal("2,50")).toBe(2.5);
        expect(parseLocalizedDecimal("2.50")).toBe(2.5);
        expect(parseLocalizedDecimal("")).toBe(0);
    });

    it("returns NaN for invalid prices", () => {
        expect(Number.isNaN(parseLocalizedDecimal("2,50,1"))).toBe(true);
    });
});
