import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './MainPage.css';
import profileImage from '../images/profile.png';

const allTimes = Array.from({ length: 23 }, (_, i) => `${i + 1}:00`);

const MainPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [gitUsername, setGitUsername] = useState(null);
  const [commitStatus, setCommitStatus] = useState(t('mainPage.statusChecking'));
  const [selectedTimes, setSelectedTimes] = useState(new Set());
  const [usernameInput, setUsernameInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchAlarmSettings = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/contributions/alarm');
      setSelectedTimes(new Set(data.data.alarmHours.map(h => `${h}:00`)));
    } catch (error) {
      console.error("Failed to fetch alarm settings", error);
    }
  }, []);

  const fetchCommitStatus = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/contributions/status');
      setCommitStatus(data.data.committed ? t('mainPage.committed') : t('mainPage.notCommitted'));
    } catch (error) {
      console.error("Failed to fetch commit status", error);
    }
  }, [t]);

  const fetchGitUsername = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/contributions/git-username');
      if (data.success && data.data?.gitUsername) {
        setGitUsername(data.data.gitUsername);
        fetchAlarmSettings();
        fetchCommitStatus();
      } else {
        setGitUsername('');
      }
    } catch (error) {
      console.error("Failed to fetch GitHub username", error);
      setGitUsername('');
    }
  }, [fetchAlarmSettings, fetchCommitStatus]);

  useEffect(() => {
    fetchGitUsername();
  }, [fetchGitUsername]);
  
  // Language change effect
  useEffect(() => {
    if(gitUsername) { // Re-fetch status only if username is loaded
        fetchCommitStatus();
    }
  }, [t, gitUsername, fetchCommitStatus]);


  const handleUsernameSubmit = async () => {
    if (!usernameInput.trim()) return;
    try {
      await apiClient.put('/contributions/git-username', { gitUsername: usernameInput });
      fetchGitUsername();
    } catch (error) {
      alert(t('mainPage.registrationFailed'));
    }
  };

  const handleApply = async () => {
    const times = Array.from(selectedTimes).map(t => parseInt(t));
    try {
      await apiClient.patch('/contributions/alarm', { alarmHours: times });
      alert(t('mainPage.applySuccess'));
    } catch (error) {
      alert(t('mainPage.applyFailed'));
    }
  };

  const toggleTimeSlot = (time) => {
    const newSelectedTimes = new Set(selectedTimes);
    if (newSelectedTimes.has(time)) {
      newSelectedTimes.delete(time);
    } else {
      newSelectedTimes.add(time);
    }
    setSelectedTimes(newSelectedTimes);
  };

  return (
    <>
      <div className="topbar">
        <div className="profile-dropdown">
          <button id="profile-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <img src={profileImage} alt="profile" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => {
                navigate('/mypage');
                setIsDropdownOpen(false);
              }}>{t('my')}</button>
              <button onClick={logout}>{t('logout')}</button>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div id="username-wrapper">
          <h1>{gitUsername === null ? t('mainPage.loading') : gitUsername || t('mainPage.githubUsername')}</h1>
          {gitUsername === '' && (
            <div id="username-input-area">
              <p>{t('mainPage.registerPrompt')}</p>
              <input
                type="text"
                id="username-input"
                placeholder={t('mainPage.usernameInputPlaceholder')}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <button id="username-submit" onClick={handleUsernameSubmit}>{t('mainPage.registerButton')}</button>
            </div>
          )}
        </div>

        {gitUsername && (
          <>
            <div id="status-wrapper">
              <p id="commit-status">{commitStatus}</p>
            </div>
            <div id="grid-wrapper">
              <h2>{t('mainPage.alarmSettingsTitle')}</h2>
              <div id="time-grid">
                {allTimes.map(time => (
                  <div
                    key={time}
                    className={`time-slot ${selectedTimes.has(time) ? 'active' : ''}`}
                    onClick={() => toggleTimeSlot(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
            <button id="apply-btn" onClick={handleApply}>{t('mainPage.applyButton')}</button>
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;