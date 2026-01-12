import { Outlet } from "react-router-dom";

import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";
import NavBar from "../Components/Nav-Bar";

import '../styles/Customer/main.css'

export default function LayoutCliente() {
    useBodyClass("customer");

    return (
        <>
            <header>
                <Logo name="customer"/>
                <NavBar />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>Footer público</footer>
        </>
    );
}
