import { Outlet } from "react-router-dom";

import DashboardMenu from "../Components/Dashboard-Menu";

import '../styles/Admin/main.css'
import useBodyClass from "../Hooks/useBodyClass";
import Logo from "../Components/Logo";
import { useAuth } from "../Auth/Auth-Context";

export default function LayoutAdmin() {
    useBodyClass("admin");
    const { roleName, sessionUserId } = useAuth();

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <Logo name={"admin"} />
                <DashboardMenu />
            </aside>
            <main className="dashboard-admin">
                <section className="dashboard-admin__header">
                    <div>
                        <p className="dashboard-admin__eyebrow">Gestaurante backoffice</p>
                        <h1>Dashboard administrativo</h1>
                        <p>
                            Vista segura para personal autorizado. El acceso depende del token
                            valido y del rol asociado al usuario autenticado.
                        </p>
                    </div>

                    <div className="dashboard-admin__session">
                        <span>{roleName}</span>
                        <strong>{sessionUserId ? String(sessionUserId).slice(0, 8) : "Sin ID"}</strong>
                    </div>
                </section>
                <Outlet />
            </main>
        </div>
    );
}
