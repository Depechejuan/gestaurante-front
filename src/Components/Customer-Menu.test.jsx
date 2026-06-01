import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerMenu from "./Customer-Menu";

const authState = vi.hoisted(() => ({
    hasToken: false,
    roleName: null,
    logout: vi.fn()
}));

const customerAuthState = vi.hoisted(() => ({
    hasCustomerSession: false,
    logout: vi.fn()
}));

vi.mock("../Auth/Auth-Context", () => ({
    useAuth: () => authState
}));

vi.mock("../Auth/Customer-Auth-Context", () => ({
    useCustomerAuth: () => customerAuthState
}));

function renderMenu() {
    return render(
        <MemoryRouter>
            <CustomerMenu isMenuOpen={false} closeMenu={vi.fn()} />
        </MemoryRouter>
    );
}

describe("CustomerMenu", () => {
    beforeEach(() => {
        authState.hasToken = false;
        authState.roleName = null;
        customerAuthState.hasCustomerSession = false;
    });

    it("links admins to the admin dashboard from the public menu", () => {
        authState.hasToken = true;
        authState.roleName = "Administrador";

        renderMenu();

        const dashboardLinks = screen.getAllByRole("link", { name: "Dashboard" });
        expect(dashboardLinks).toHaveLength(2);
        expect(dashboardLinks[0]).toHaveAttribute("href", "/dashboard");
        expect(screen.queryByRole("link", { name: "Mi cuenta" })).not.toBeInTheDocument();
    });

    it("links non-admin employees to staff from the public menu", () => {
        authState.hasToken = true;
        authState.roleName = "Repartidor";

        renderMenu();

        expect(screen.getAllByRole("link", { name: "Dashboard" })[0]).toHaveAttribute("href", "/staff");
        expect(screen.queryByRole("link", { name: "Mi cuenta" })).not.toBeInTheDocument();
    });

    it("keeps the customer account link for customer sessions", () => {
        customerAuthState.hasCustomerSession = true;

        renderMenu();

        expect(screen.getAllByRole("link", { name: "Mi cuenta" })[0]).toHaveAttribute("href", "/cuenta");
        expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
    });
});
