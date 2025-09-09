import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { setupAuthInterceptor } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSessionExpired = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/login');
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
        // [수정] 요청 시 config 객체에 skipAuthRefresh: true 플래그를 추가합니다.
        // 이 표식을 통해 인터셉터가 해당 요청은 토큰 재발급 로직에서 제외하도록 합니다.
        await apiClient.get('/contributions/git-username', { skipAuthRefresh: true });
        setIsAuthenticated(true);
      } catch (error) {
        // 인터셉터가 재발급을 시도하지 않으므로, 실패 시 바로 catch 블록으로 들어옵니다.
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