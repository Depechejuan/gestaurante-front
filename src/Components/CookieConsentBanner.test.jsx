import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CookieConsentBanner, { COOKIE_CONSENT_STORAGE_KEY } from "./CookieConsentBanner";

function renderBanner() {
    return render(
        <MemoryRouter>
            <CookieConsentBanner />
        </MemoryRouter>
    );
}

describe("CookieConsentBanner", () => {
    it("shows the cookie actions when no choice has been stored", () => {
        renderBanner();

        expect(screen.getByLabelText("Aviso sobre cookies")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Aceptar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Más información" })).toHaveAttribute(
            "href",
            "/politica-cookies"
        );
    });

    it("hides the banner when the user accepts cookies", async () => {
        const user = userEvent.setup();
        renderBanner();

        await user.click(screen.getByRole("button", { name: "Aceptar" }));

        expect(screen.queryByLabelText("Aviso sobre cookies")).not.toBeInTheDocument();
        expect(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe("accepted");
    });

    it("hides the banner when the user rejects cookies", async () => {
        const user = userEvent.setup();
        renderBanner();

        await user.click(screen.getByRole("button", { name: "Rechazar" }));

        expect(screen.queryByLabelText("Aviso sobre cookies")).not.toBeInTheDocument();
        expect(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe("rejected");
    });
});
