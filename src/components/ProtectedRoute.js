import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // 인증 상태 확인 중 로딩 표시
  }

  if (!isAuthenticated) {
    // 로그인되어 있지 않으면 로그인 페이지로 리디렉션
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;