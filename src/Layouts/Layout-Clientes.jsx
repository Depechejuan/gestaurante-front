import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

export default function LayoutCliente() {
    useBodyClass("customer");

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
