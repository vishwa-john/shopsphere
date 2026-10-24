import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">
        Verifying secure session...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
