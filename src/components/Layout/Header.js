// src/components/Layout/Header.js
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import { useDarkMode } from '../../hooks/useDarkMode';
import './Header.css';

const Header = () => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src={`${process.env.PUBLIC_URL}/assets/icons/cosylanguages_logos/cosylanguages.png`} alt="Cosy Languages Logo" />
          <span>COSYlanguages</span>
        </Link>
        <nav className="header-nav">
          <NavLink to="/freestyle" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Freestyle</NavLink>
          <NavLink to="/study" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Study Mode</NavLink>
          <NavLink to="/community" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Community</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Calculator</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-sets" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>
              <TransliterableText text={t('navMyStudySets') || 'My Sets'} />
            </NavLink>
          )}
        </nav>
        <div className="header-controls">
          <div className="header-language-selector">
            <LanguageSelector />
          </div>
          <Button
            onClick={toggleDarkMode}
            variant="contained"
            color="secondary"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          {isAuthenticated && currentUser ? (
            <div className="user-info">
              <NavLink to="/profile" className="profile-link">
                <TransliterableText text={t('welcomeUser', { name: currentUser.username || currentUser.role || 'User' }) || `Welcome, ${currentUser.username || currentUser.role || 'User'}!`} />
              </NavLink>
              <Button
                onClick={handleLogout}
                disabled={loadingAuth}
                variant="outlined"
                color="secondary"
              >
                {loadingAuth ? (t('loggingOut') || 'Logging out...') : (t('btnLogout') || 'Logout')}
              </Button>
            </div>
          ) : !loadingAuth && (
            <NavLink to="/login" className="login-link">
              <TransliterableText text={t('btnLogin') || 'Login'} />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
