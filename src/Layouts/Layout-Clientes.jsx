import { Outlet } from "react-router-dom";

import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";
import NavBar from "../Components/NavBar";

import '../styles/Customer/main.css'

export default function LayoutCliente() {
    useBodyClass("customer");

    return (
        <>
            <header>
                <Logo name="customer"/>
                <NavBar input="customer" />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>Footer público</footer>
        </>
    );
}
