import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";

export default function CustomerProtectedRoute() {
    const location = useLocation();
    const { customer, loading } = useCustomerAuth();

    if (loading) {
        return null;
    }

    if (!customer) {
        return <Navigate to="/login" replace state={{ redirectTo: `${location.pathname}${location.search}` }} />;
    }

    return <Outlet />;
}
