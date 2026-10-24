import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">
        Verifying administrator credentials...
      </div>
    );
  }

  return isAuthenticated && user?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute;
