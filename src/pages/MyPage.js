// src/pages/MyPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './MyPage.css';

const MyPage = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();

    const [userInfo, setUserInfo] = useState({ email: '', country: '' });
    const [gitUsername, setGitUsername] = useState('');
    const [isEditingGit, setIsEditingGit] = useState(false);
    const [newGitUsername, setNewGitUsername] = useState('');
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCreds, setDeleteCreds] = useState({ loginId: '', password: '' });

    const fetchUserData = useCallback(async () => {
        try {
            const [infoRes, gitUserRes] = await Promise.all([
                apiClient.get('/member/info'),
                apiClient.get('/contributions/git-username')
            ]);
            if (infoRes.data.success && infoRes.data.data) {
                setUserInfo({
                    email: infoRes.data.data.email,
                    country: infoRes.data.data.country
                });
            }
            if (gitUserRes.data.success && gitUserRes.data.data?.gitUsername) {
                setGitUsername(gitUserRes.data.data.gitUsername);
                setNewGitUsername(gitUserRes.data.data.gitUsername);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            alert(t('myPage.fetchError'));
        }
    }, [t]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleGitUsernameUpdate = async () => {
        try {
            await apiClient.put('/contributions/git-username', { gitUsername: newGitUsername });
            setGitUsername(newGitUsername);
            setIsEditingGit(false);
            alert(t('myPage.updateGitSuccess'));
        } catch (error) {
            console.error("Failed to update GitHub username:", error);
            alert(t('myPage.updateGitFailed'));
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert(t('myPage.passwordMatchError'));
            return;
        }
        try {
            await apiClient.post('/member/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            alert(t('myPage.passwordChangeSuccess'));
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Failed to change password:", error);
            alert(t('myPage.passwordChangeFailed'));
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            await apiClient.delete('/member/delete', { data: deleteCreds });
            alert(t('myPage.withdrawalSuccess'));
            logout();
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert(t('myPage.withdrawalFailed'));
        }
    };

    return (
        <div className="mypage-container">
            <h1>{t('myPage.title')}</h1>

            <div className="mypage-section">
                <h2>{t('myPage.infoTitle')}</h2>
                <div className="info-item"><strong>{t('myPage.email')}:</strong> <span>{userInfo.email}</span></div>
                <div className="info-item"><strong>{t('myPage.country')}:</strong> <span>{userInfo.country}</span></div>
                <div className="info-item">
                    <strong>{t('myPage.githubName')}:</strong>
                    {!isEditingGit ? (
                        <>
                            <span>{gitUsername}</span>
                            <button onClick={() => setIsEditingGit(true)} className="edit-btn">{t('myPage.edit')}</button>
                        </>
                    ) : (
                        <div className="edit-area">
                            <input type="text" value={newGitUsername} onChange={(e) => setNewGitUsername(e.target.value)} />
                            <button onClick={handleGitUsernameUpdate} className="save-btn">{t('myPage.save')}</button>
                            <button onClick={() => setIsEditingGit(false)} className="cancel-btn">{t('myPage.cancel')}</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mypage-section">
                <h2>{t('myPage.passwordChangeTitle')}</h2>
                <form onSubmit={handlePasswordChange}>
                    <input type="password" placeholder={t('myPage.oldPassword')} value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required />
                    <input type="password" placeholder={t('myPage.newPassword')} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                    <input type="password" placeholder={t('myPage.confirmNewPassword')} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                    <button type="submit" className="action-btn">{t('myPage.changePasswordButton')}</button>
                </form>
            </div>

            <div className="mypage-section delete-section">
                <h2>{t('myPage.withdrawalTitle')}</h2>
                <button onClick={() => setShowDeleteConfirm(!showDeleteConfirm)} className="delete-toggle-btn">
                    {showDeleteConfirm ? t('myPage.cancel') : t('myPage.withdrawalButton')}
                </button>
                {showDeleteConfirm && (
                    <form onSubmit={handleDeleteAccount} className="delete-confirm-area">
                        <p>{t('myPage.withdrawalPrompt')}</p>
                        <input type="text" placeholder={t('myPage.loginId')} value={deleteCreds.loginId} onChange={(e) => setDeleteCreds({ ...deleteCreds, loginId: e.target.value })} required />
                        <input type="password" placeholder={t('myPage.password')} value={deleteCreds.password} onChange={(e) => setDeleteCreds({ ...deleteCreds, password: e.target.value })} required />
                        <button type="submit" className="delete-confirm-btn">{t('myPage.confirmWithdrawal')}</button>
                    </form>
                )}
            </div>

            <Link to="/main" className="back-link">{t('myPage.backToMain')}</Link>
        </div>
    );
};

export default MyPage;