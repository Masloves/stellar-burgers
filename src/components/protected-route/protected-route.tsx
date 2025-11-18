import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // понадобится в дальнейшей реализации

interface ProtectedRouteProps {
  onlyUnauth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute = ({
  onlyUnauth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  const location = useLocation();

  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
