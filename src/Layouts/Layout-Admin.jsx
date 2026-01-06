import { useEffect, Outlet } from "react-router-dom";

import DashboardHeader from "../Components/Dashboard-Header";
import DashboardNav from "../Components/Dashboard-Nav";

export default function LayoutAdmin() {
    useEffect(() => {
        document.body.classList.add("admin");

        return () => {
            document.body.classList.remove("admin");
        };
    }, []);
    
    
    return (
        <>
            <header>
                <DashboardHeader user={"hola"} />
            </header>
            <aside>
                <DashboardNav />
            </aside>

            <main className="dashboard-admin">
                <h1>Hola</h1>
                <Outlet />
            </main>
        </>
    );
}
