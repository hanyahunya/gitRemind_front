import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
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
        setMessage(t('loginPage.invalidCredentials'));
      }
    } catch (error) {
      setMessage(t('loginPage.loginError'));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="title">{t('loginPage.title')}</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">{t('loginPage.usernameLabel')}</label>
          <input
            type="text"
            id="username"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
          <label htmlFor="password">{t('loginPage.passwordLabel')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="login-message">{message}</p>}
          <button type="submit">{t('loginPage.signInButton')}</button>
        </form>
        <p className="signup-link">
          <Trans i18nKey="loginPage.signupLink">
            New to gitremind? <Link to="/signup">Create an account</Link>
          </Trans>
        </p>
        <Link to="/" className="back-link">{t('loginPage.backToHome', 'Back to Home')}</Link>
      </div>
    </div>
  );
};

export default LoginPage;
