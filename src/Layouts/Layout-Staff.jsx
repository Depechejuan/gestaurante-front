// layouts/StaffLayout.jsx
import { Outlet } from "react-router-dom";

export default function LayoutStaff() {
    return (
        <div className="dashboard">
            <aside>Menú staff</aside>
            <section>
                <Outlet />
            </section>
        </div>
    );
}
