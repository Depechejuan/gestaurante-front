import { Outlet } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";

export default function LayoutStaff() {
    useBodyClass("staff");

    
    return (
        <div className="dashboard">
            <aside>Menú staff</aside>
            <section>
                <Outlet />
            </section>
        </div>
    );
}
