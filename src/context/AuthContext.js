import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { setupAuthInterceptor } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 💡 1. [추가] 세션 만료 시 호출될 함수. API 호출 없이 상태만 바꾼다.
  const handleSessionExpired = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/login'); // 로그인 페이지로 이동
    console.log("Session expired, client state cleared.");
  }, [navigate]);

  // 💡 2. [수정] 기존 logout 함수는 이제 UI에서만 사용.
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
    // 💡 3. [수정] 인터셉터에 새 함수를 전달.
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

    checkAuthStatus();
  }, [handleSessionExpired]);

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