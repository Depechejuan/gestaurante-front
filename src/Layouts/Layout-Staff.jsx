import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";

import '../styles/Staff/main.css'
import NavBar from "../Components/NavBar";
import { useAuth } from "../Auth/Auth-Context";

export default function LayoutStaff() {
    useBodyClass("staff");
    const { roleName } = useAuth();

    return (
        <div className="staff-shell">
            <header className="staff-header">
                <Logo name={"staff"}/>
                <div className="staff-header__copy">
                    <p className="staff-header__eyebrow">Operacion diaria</p>
                    <h1>Panel de staff</h1>
                    <span>{roleName}</span>
                </div>
                <NavBar input={"staff"} />
            </header>
            <main className="staff-main">
                <Outlet />
            </main>
        </div>
    );
}
