import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Register from "./Register";

vi.mock("../../services/get-token", () => ({
    default: () => ({ token: "token-1" })
}));

vi.mock("../../services/register", () => ({
    default: vi.fn()
}));

describe("Register", () => {
    it("includes the repartidor role option", () => {
        render(<Register />);

        expect(screen.getByRole("option", { name: "Repartidor" })).toHaveValue("3");
    });
});
