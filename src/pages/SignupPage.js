import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';
import './SignupPage.css';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    country: '',
    email: '',
    authCode: ''
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [authSectionVisible, setAuthSectionVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      alert(t('signupPage.alertEnterEmail'));
      return;
    }
    try {
      await apiClient.post('/auth-code', { email: formData.email });
      alert(t('signupPage.alertSent'));
      setAuthSectionVisible(true);
    } catch (error) {
      alert(t('signupPage.alertSendFail'));
    }
  };

  const handleVerifyCode = async () => {
    try {
      await apiClient.post('/auth-code/validate', {
        email: formData.email,
        authCode: formData.authCode
      });
      alert(t('signupPage.alertSuccess'));
      setEmailVerified(true);
    } catch (error) {
      alert(t('signupPage.alertCodeWrong'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      alert(t('signupPage.alertNeedVerify'));
      return;
    }
    try {
      await apiClient.post('/member/join', {
        loginId: formData.loginId,
        password: formData.password,
        country: formData.country,
      });
      alert(t('signupPage.alertJoinSuccess'));
      navigate('/login');
    } catch (error) {
      alert(t('signupPage.alertJoinFail'));
    }
  };

  return (
    <div className="signup-container">
      <h2>{t('signupPage.title')}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="loginId">{t('signupPage.loginId')}</label>
        <input type="text" id="loginId" name="loginId" value={formData.loginId} onChange={handleChange} required />

        <label htmlFor="password">{t('signupPage.password')}</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

        <label htmlFor="country">{t('signupPage.country')}</label>
        <select id="country" name="country" value={formData.country} onChange={handleChange} required>
          <option value="">{t('signupPage.selectCountry')}</option>
          <option value="KR">{t('signupPage.KR')}</option>
          <option value="US">{t('signupPage.US')}</option>
          <option value="JP">{t('signupPage.JP')}</option>
        </select>

        <label htmlFor="email">{t('signupPage.email')}</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        <button type="button" className="secondary-btn" onClick={handleSendCode}>{t('signupPage.sendBtn')}</button>

        {authSectionVisible && (
          <div className="authSection">
            <label htmlFor="authCode">{t('signupPage.authCode')}</label>
            <input type="text" id="authCode" name="authCode" value={formData.authCode} onChange={handleChange} />
            <button type="button" className="secondary-btn" onClick={handleVerifyCode}>{t('signupPage.verifyBtn')}</button>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={!emailVerified}>{t('signupPage.submitBtn')}</button>
      </form>
      <Link to="/" className="back-link">{t('signupPage.backToHome')}</Link>
    </div>
  );
};

export default SignupPage;