import { Outlet } from "react-router-dom";

import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";
import NavBar from "../Components/NavBar";

import '../styles/Customer/main.css'

export default function LayoutCliente() {
    useBodyClass("customer");

    return (
        <div className="customer-shell">
            <header className="customer-header">
                <Logo name="customer"/>
                <NavBar input="customer" />
            </header>
            <main id="main-customer">
                <Outlet />
            </main>
            <footer className="customer-footer">
                <div>
                    <p className="customer-footer__brand">Gestaurante</p>
                    <p>Cocina honesta, servicio cercano y una experiencia pensada para disfrutar sin prisa.</p>
                </div>
                <div>
                    <p className="customer-footer__label">Visitanos</p>
                    <p>Calle Ficticia 123 · Alicante</p>
                    <p>Mar-Dom · 13:00-16:00 / 20:00-23:30</p>
                </div>
                <div>
                    <p className="customer-footer__label">Contacto</p>
                    <p>admin@gestaurante.com</p>
                    <p>+34 666 123 456</p>
                </div>
            </footer>
        </div>
    );
}
