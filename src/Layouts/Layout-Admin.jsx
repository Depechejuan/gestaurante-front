import { Outlet } from "react-router-dom";

import DashboardHeader from "../Components/Dashboard-Header";
import DashboardNav from "../Components/Dashboard-Nav";

import '../styles/Admin/main.css'
import useBodyClass from "../Hooks/useBodyClass";
import Logo from "../Components/Logo";

export default function LayoutAdmin() {
    useBodyClass("admin");

    return (
        <>
            <aside>
                <Logo name={"admin"} />
                <DashboardNav />
            </aside>
            <main className="dashboard-admin">
                <h1>Hola</h1>
                <Outlet />
            </main>
        </>
    );
}
