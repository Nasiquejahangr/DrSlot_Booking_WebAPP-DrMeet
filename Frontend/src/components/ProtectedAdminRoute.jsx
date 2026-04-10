import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    // Check if admin is logged in
    const adminId = sessionStorage.getItem('adminId');
    const adminEmail = sessionStorage.getItem('adminEmail');

    // If not logged in as admin, redirect to admin login
    if (!adminId || !adminEmail) {
        return <Navigate to="/admin-login" replace />;
    }

    // If logged in, render the component
    return children;
};

export default ProtectedAdminRoute;
