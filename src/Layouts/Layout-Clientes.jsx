// layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";

export default function LayoutCliente() {
    return (
        <>
            <header>Menú cliente</header>
            <main>
                <Outlet />
            </main>
            <footer>Footer público</footer>
        </>
    );
}
