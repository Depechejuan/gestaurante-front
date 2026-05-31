import { describe, expect, it } from "vitest";
import { resolveEmployeeRoleName, resolveEmployeeRoleValue } from "./roles";

describe("employee role helpers", () => {
    it("resolves numeric string role values", () => {
        expect(resolveEmployeeRoleName("3")).toBe("Repartidor");
        expect(resolveEmployeeRoleValue("3")).toBe(3);
    });
});
