// src/components/PrivateRoute.tsx
import { AuthContext } from '@/context/AuthContext';
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps{
  role: string;
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    role,
    element,
}) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    console.error('AuthContext is not provided.');
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, role: userRole } = authContext;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;

};

export default PrivateRoute;
