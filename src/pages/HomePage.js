import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <header className="header">
        <div></div>
        <nav className="auth-buttons">
          <button onClick={() => navigate('/login')}>{t('login')}</button>
          <button onClick={() => navigate('/signup')}>{t('signup')}</button>
        </nav>
      </header>

      <main className="main-content">
        <h1>{t('homePage.title')}</h1>
        <button className="get-started" onClick={() => navigate('/login')}>
          {t('homePage.getStarted')}
        </button>
      </main>
    </>
  );
};

export default HomePage;