import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import './LoginPage.css';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await apiClient.post('/member/login', { loginId, password });
      if (response.data.success) {
        login(); // 로그인 상태 업데이트 및 /main으로 이동
      } else {
        setMessage('아이디 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      setMessage('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="title">Sign in to gitremind</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username or email address</label>
          <input
            type="text"
            id="username"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="login-message">{message}</p>}
          <button type="submit">Sign in</button>
        </form>
        <p className="signup-link">
          New to gitremind? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;