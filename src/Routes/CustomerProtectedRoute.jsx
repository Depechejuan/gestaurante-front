import { Navigate, Outlet } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";

export default function CustomerProtectedRoute() {
    const { customer, loading } = useCustomerAuth();

    if (loading) {
        return null;
    }

    if (!customer) {
        return <Navigate to="/cuenta/login" replace />;
    }

    return <Outlet />;
}
