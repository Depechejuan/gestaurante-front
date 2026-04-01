import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

import Logo from "../Components/Logo";
import { StaffNotificationsProvider } from "../Auth/Staff-Notifications-Context";
import StaffNotificationsPanel from "../Components/Staff-Notifications-Panel";

import '../styles/Staff/main.css'
import NavBar from "../Components/NavBar";
import { useAuth } from "../Auth/Auth-Context";

export default function LayoutStaff() {
    useBodyClass("staff");
    const { roleName, displayName } = useAuth();

    return (
        <StaffNotificationsProvider>
            <div className="staff-shell">
                <header className="staff-header">
                    <Logo name={"staff"}/>
                    <div className="staff-header__copy">
                        <p className="staff-header__eyebrow">Operacion diaria</p>
                        <h1>Panel de staff</h1>
                        <span>{displayName ? `${displayName} · ${roleName}` : roleName}</span>
                    </div>
                </header>
                <StaffNotificationsPanel />
                <NavBar input={"staff"} />
                <main className="staff-main">
                    <Outlet />
                </main>
            </div>
        </StaffNotificationsProvider>
    );
}
