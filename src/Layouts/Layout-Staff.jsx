import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";
import StaffMenu from "../Components/Staff-Menu";

import '../styles/Staff/main.css'

export default function LayoutStaff() {
    useBodyClass("staff");

    return (
        <>
            <header>
                <Logo name={"staff"}/>
                <StaffMenu />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}

