import { Outlet } from "react-router-dom";

import DashboardMenu from "../Components/Dashboard-Menu";

import '../styles/Admin/main.css'
import useBodyClass from "../Hooks/useBodyClass";
import Logo from "../Components/Logo";

export default function LayoutAdmin() {
    useBodyClass("admin");

    return (
        <>
            <aside>
                <Logo name={"admin"} />
                <DashboardMenu />
            </aside>
            <main className="dashboard-admin">
                <h1>Admin Dashboard</h1>
                <p>Bienvenido {}</p>
                <Outlet />
            </main>
        </>
    );
}
