import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './MainPage.css';
import profileImage from '../images/profile.png'; // 이미지 import

const allTimes = Array.from({ length: 23 }, (_, i) => `${i + 1}:00`);

const MainPage = () => {
  const { logout } = useAuth();
  const [gitUsername, setGitUsername] = useState(null);
  const [commitStatus, setCommitStatus] = useState('커밋 상태 확인 중...');
  const [selectedTimes, setSelectedTimes] = useState(new Set());
  const [usernameInput, setUsernameInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchGitUsername = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/contributions/git-username');
      if (data.success && data.data?.gitUsername) {
        setGitUsername(data.data.gitUsername);
        fetchAlarmSettings();
        fetchCommitStatus();
      } else {
        setGitUsername(''); // 유저네임이 등록되지 않은 상태
      }
    } catch (error) {
      console.error("Failed to fetch GitHub username", error);
      setGitUsername('');
    }
  }, []);

  const fetchAlarmSettings = async () => {
    try {
      const { data } = await apiClient.get('/contributions/alarm');
      setSelectedTimes(new Set(data.data.alarmHours.map(h => `${h}:00`)));
    } catch (error) {
      console.error("Failed to fetch alarm settings", error);
    }
  };

  const fetchCommitStatus = async () => {
    try {
      const { data } = await apiClient.get('/contributions/status');
      setCommitStatus(data.data.committed ? "오늘은 커밋을 완료했습니다." : "아직 커밋하지 않았습니다.");
    } catch (error) {
      console.error("Failed to fetch commit status", error);
    }
  };

  useEffect(() => {
    fetchGitUsername();
  }, [fetchGitUsername]);

  const handleUsernameSubmit = async () => {
    if (!usernameInput.trim()) return;
    try {
      await apiClient.put('/contributions/git-username', { gitUsername: usernameInput });
      fetchGitUsername();
    } catch (error) {
      alert("깃허브 유저이름 등록에 실패했습니다.");
    }
  };
  
  const handleApply = async () => {
    const times = Array.from(selectedTimes).map(t => parseInt(t));
    try {
        await apiClient.patch('/contributions/alarm', { alarmHours: times });
        alert("적용 완료");
    } catch (error) {
        alert("적용 실패");
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
              <button>마이페이지</button>
              <button onClick={logout}>로그아웃</button>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div id="username-wrapper">
          <h1>{gitUsername === null ? '로딩 중...' : gitUsername || 'GitHub 유저명'}</h1>
          {gitUsername === '' && (
            <div id="username-input-area">
              <p>깃허브 유저이름을 먼저 등록해주세요.</p>
              <input 
                type="text" 
                id="username-input" 
                placeholder="GitHub 유저이름 입력"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <button id="username-submit" onClick={handleUsernameSubmit}>등록</button>
            </div>
          )}
        </div>

        {gitUsername && (
          <>
            <div id="status-wrapper">
              <p id="commit-status">{commitStatus}</p>
            </div>
            <div id="grid-wrapper">
              <h2>알람 시간 설정</h2>
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
            <button id="apply-btn" onClick={handleApply}>적용</button>
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;