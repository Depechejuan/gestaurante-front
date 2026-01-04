import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import getToken from "../services/get-token";
import DashboardHeader from "../Components/Dashboard-Header";
import getBasicUser from "../services/get-basic-user";
import DashboardNav from "../Components/Dashboard-Nav";

export default function LayoutAdmin() {
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        if (!token) navigate("/");
    }, [token, navigate]);

    const user = getBasicUser(token)

    return (
        <>
            <aside>
                <DashboardNav />
            </aside>
            <header>
                <DashboardHeader user={user ? user : "hola"} />
            </header>

            <section>
                <Outlet />
            </section>
        </>
    );
}
