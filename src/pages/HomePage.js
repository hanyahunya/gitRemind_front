import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState({
    title: '커밋을 놓치지 마세요',
    getStarted: '시작하기',
    login: '로그인',
    signup: '회원가입',
  });

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('en')) {
      setText({
        title: 'Never miss a commit',
        getStarted: 'Get Started',
        login: 'Login',
        signup: 'Sign Up',
      });
    } else if (userLang.startsWith('ja')) {
      setText({
        title: '今日の分、コミットしましたか？',
        getStarted: '始める',
        login: 'ログイン',
        signup: '新規登録',
      });
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="logo">gitremind</div>
        <nav className="auth-buttons">
          <button onClick={() => navigate('/login')}>{text.login}</button>
          <button onClick={() => navigate('/signup')}>{text.signup}</button>
        </nav>
      </header>

      <main className="main-content">
        <h1>{text.title}</h1>
        <button className="get-started" onClick={() => navigate('/login')}>
          {text.getStarted}
        </button>
      </main>
    </>
  );
};

export default HomePage;