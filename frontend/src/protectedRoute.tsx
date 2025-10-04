import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { loadUser } from "@/store/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { token, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Check if token exists in localStorage
  const tokenFromStorage = localStorage.getItem('token');
  
  // Load user data if token exists but user is not loaded
  useEffect(() => {
    if (tokenFromStorage && !user && !isLoading) {
      dispatch(loadUser());
    }
  }, [tokenFromStorage, user, isLoading, dispatch]);

  const isAuthenticated = !!(token || tokenFromStorage) && !!user;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
