import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";

import '../styles/Staff/main.css'
import NavBar from "../Components/NavBar";

export default function LayoutStaff() {
    useBodyClass("staff");

    return (
        <>
            <header>
                <Logo name={"staff"}/>
                <NavBar input={"staff"} />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}

