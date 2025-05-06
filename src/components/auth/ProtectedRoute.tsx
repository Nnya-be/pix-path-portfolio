
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ 
  redirectPath = '/auth',
  children 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
}
