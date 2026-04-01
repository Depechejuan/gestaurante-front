import { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardMenu from "../Components/Dashboard-Menu";

import '../styles/Admin/main.css'
import useBodyClass from "../Hooks/useBodyClass";
import Logo from "../Components/Logo";
import { useAuth } from "../Auth/Auth-Context";
import menuIcon from "../assets/Icons/menu.svg";

export default function LayoutAdmin() {
    useBodyClass("admin");
    const { roleName, displayName } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <Logo name={"admin"} />
                <DashboardMenu />
            </aside>
            <button
                type="button"
                className="admin-mobile-toggle"
                aria-label="Abrir menu de administracion"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
                <img src={menuIcon} alt="" />
            </button>
            {isMobileMenuOpen && (
                <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="admin-mobile-panel" onClick={(event) => event.stopPropagation()}>
                        <div className="admin-mobile-panel__header">
                            <p>Accesos admin</p>
                            <button type="button" onClick={() => setIsMobileMenuOpen(false)}>
                                Cerrar
                            </button>
                        </div>
                        <DashboardMenu className="dashboard-nav--mobile" onNavigateLink={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}
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
                        <strong>{displayName || "Sin sesion"}</strong>
                    </div>
                </section>
                <Outlet />
            </main>
        </div>
    );
}
