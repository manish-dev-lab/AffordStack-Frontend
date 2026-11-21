import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

export const UserProtectedRoute: React.FC = () => {
  const { isUserAuthenticated } = useUserAuth();
  const location = useLocation();

  if (!isUserAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
