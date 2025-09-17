// src/routes/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { ROUTES } from "@/config/routes";

export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // keep UI stable while auth state loads

    if (!user) {
        const next = encodeURIComponent(location.pathname + location.search);
        return (
            <Navigate
                to={`${ROUTES.HOME}?auth=login&next=${next}`}
                replace
            />
        );
    }
    return children;
}
