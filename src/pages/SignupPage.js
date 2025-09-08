import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './SignupPage.css';

const text = {
  ko: {
    title: '회원가입',
    loginId: '아이디',
    password: '비밀번호',
    country: '국가',
    email: '이메일',
    sendBtn: '이메일 인증 요청',
    authCode: '인증번호',
    verifyBtn: '인증번호 확인',
    submitBtn: '회원가입',
    alertEnterEmail: '이메일을 입력하세요.',
    alertSent: '인증번호가 이메일로 전송되었습니다.',
    alertSendFail: '인증 요청 실패',
    alertSuccess: '이메일 인증이 완료되었습니다.',
    alertCodeWrong: '인증번호가 올바르지 않습니다.',
    alertNeedVerify: '이메일 인증을 먼저 완료해주세요.',
    alertJoinSuccess: '회원가입이 완료되었습니다.',
    alertJoinFail: '회원가입 실패',
  },
  ja: {
    title: 'アカウント登録',
    loginId: 'ユーザーID',
    password: 'パスワード',
    country: '国',
    email: 'メールアドレス',
    sendBtn: '認証コードを送信',
    authCode: '認証コード',
    verifyBtn: '認証を確認',
    submitBtn: '登録',
    alertEnterEmail: 'メールアドレスを入力してください。',
    alertSent: '認証コードが送信されました。',
    alertSendFail: '認証リクエストに失敗しました。',
    alertSuccess: 'メール認証が完了しました。',
    alertCodeWrong: '認証コードが正しくありません。',
    alertNeedVerify: 'メール認証を完了してください。',
    alertJoinSuccess: '登録が完了しました。',
    alertJoinFail: '登録に失敗しました。',
  },
  en: {
    title: 'Sign Up',
    loginId: 'Username',
    password: 'Password',
    country: 'Country',
    email: 'Email',
    sendBtn: 'Send Auth Code',
    authCode: 'Auth Code',
    verifyBtn: 'Verify Code',
    submitBtn: 'Sign Up',
    alertEnterEmail: 'Please enter your email.',
    alertSent: 'Auth code sent to your email.',
    alertSendFail: 'Failed to send code.',
    alertSuccess: 'Email verified.',
    alertCodeWrong: 'Invalid auth code.',
    alertNeedVerify: 'Please verify your email first.',
    alertJoinSuccess: 'Signup completed.',
    alertJoinFail: 'Signup failed.',
  }
};

const SignupPage = () => {
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

    const lang = useMemo(() => {
        const userLang = navigator.language;
        return userLang.startsWith('ja') ? 'ja' : userLang.startsWith('en') ? 'en' : 'ko';
    }, []);
    const t = text[lang];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendCode = async () => {
        if (!formData.email) {
            alert(t.alertEnterEmail);
            return;
        }
        try {
            await apiClient.post('/auth-code', { email: formData.email });
            alert(t.alertSent);
            setAuthSectionVisible(true);
        } catch (error) {
            alert(t.alertSendFail);
        }
    };

    const handleVerifyCode = async () => {
        try {
            await apiClient.post('/auth-code/validate', {
                email: formData.email,
                authCode: formData.authCode
            });
            alert(t.alertSuccess);
            setEmailVerified(true);
        } catch (error) {
            alert(t.alertCodeWrong);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailVerified) {
            alert(t.alertNeedVerify);
            return;
        }
        try {
            await apiClient.post('/member/join', {
                loginId: formData.loginId,
                password: formData.password,
                country: formData.country,
            });
            alert(t.alertJoinSuccess);
            navigate('/login');
        } catch (error) {
            alert(t.alertJoinFail);
        }
    };

    return (
        <div className="signup-container">
            <h2>{t.title}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="loginId">{t.loginId}</label>
                <input type="text" id="loginId" name="loginId" value={formData.loginId} onChange={handleChange} required />

                <label htmlFor="password">{t.password}</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

                <label htmlFor="country">{t.country}</label>
                <select id="country" name="country" value={formData.country} onChange={handleChange} required>
                    <option value="">-- 국가 선택 --</option>
                    <option value="KR">대한민국</option>
                    <option value="US">US</option>
                    <option value="JP">日本</option>
                </select>

                <label htmlFor="email">{t.email}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <button type="button" className="secondary-btn" onClick={handleSendCode}>{t.sendBtn}</button>

                {authSectionVisible && (
                    <div className="authSection">
                        <label htmlFor="authCode">{t.authCode}</label>
                        <input type="text" id="authCode" name="authCode" value={formData.authCode} onChange={handleChange} />
                        <button type="button" className="secondary-btn" onClick={handleVerifyCode}>{t.verifyBtn}</button>
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={!emailVerified}>{t.submitBtn}</button>
            </form>
        </div>
    );
};

export default SignupPage;