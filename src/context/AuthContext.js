import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 앱이 처음 로드될 때, 서버에 쿠키 유효성을 확인하여 로그인 상태를 설정
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

    checkAuthStatus();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    navigate('/main');
  };

  const logout = async () => {
    try {
      await apiClient.post('/member/logout');
    } finally {
      setIsAuthenticated(false);
      // 상태를 완전히 초기화하기 위해 페이지를 새로고침하며 이동
      window.location.replace('/');
    }
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