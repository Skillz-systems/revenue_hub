import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = Cookies.get("userToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        console.log("Protected Route Token:", token);
    }, [token]);

    return children; // Render children if user is authenticated
};

export default ProtectedRoute;