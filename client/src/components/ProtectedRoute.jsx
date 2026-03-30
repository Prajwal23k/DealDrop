import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    // 🔥 WAIT until auth is checked
    if (loading) {
        return <p>Loading...</p>; // or spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export {ProtectedRoute};