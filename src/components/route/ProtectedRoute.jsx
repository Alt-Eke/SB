import React from 'react';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-navy text-white px-6 py-2 rounded-md hover:bg-navy-light"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;