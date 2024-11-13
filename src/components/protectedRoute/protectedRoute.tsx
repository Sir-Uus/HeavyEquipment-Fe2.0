import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const role = localStorage.getItem("role");
  const isAllowed = role && allowedRoles.includes(role);

  if (!isAllowed) {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;