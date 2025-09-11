// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// useLocation을 react-router-dom에서 import 합니다.
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient, { setupAuthInterceptor } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // useLocation 훅을 사용하여 location 객체를 가져옵니다.
  const location = useLocation();

  const handleSessionExpired = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/');
    console.log("Session expired, client state cleared.");
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/member/logout');
    } catch (error) {
      console.error("로그아웃 API 호출에 실패했지만 클라이언트 측 로그아웃을 진행합니다:", error);
    } finally {
      setIsAuthenticated(false);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setupAuthInterceptor(handleSessionExpired);

    const checkAuthStatus = async () => {
      try {
        await apiClient.get('/contributions/git-username');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // 현재 경로가 '/login' 또는 '/signup'이 아닌 경우에만 인증 상태를 확인합니다.
    const publicPaths = ['/login', '/signup'];
    if (!publicPaths.includes(location.pathname)) {
      checkAuthStatus();
    } else {
      // 로그인/회원가입 페이지에서는 로딩 상태만 false로 변경합니다.
      setIsLoading(false);
      setIsAuthenticated(false);
    }
    // 의존성 배열에 location.pathname을 추가하여 URL이 변경될 때마다 이펙트가 실행되도록 합니다.
  }, [handleSessionExpired, location.pathname]);

  const login = () => {
    setIsAuthenticated(true);
    navigate('/main');
  };

  const value = { isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};