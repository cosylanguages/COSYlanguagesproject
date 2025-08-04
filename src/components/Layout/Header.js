// src/components/Layout/Header.js
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import './Header.css';

const Header = () => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src={`${process.env.PUBLIC_URL}/assets/icons/cosylanguages_logos/cosylanguages.png`} alt="Cosy Languages Logo" />
          <span>COSYlanguages</span>
        </Link>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
        >
          ☰
        </button>
        <nav id="main-nav" className={`header-nav ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/freestyle" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Freestyle</NavLink>
          <NavLink to="/study" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Study Mode</NavLink>
          <NavLink to="/community" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Community</NavLink>
          <NavLink to="/calculator" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>Calculator</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-sets" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>
              <TransliterableText text={t('navMyStudySets') || 'My Sets'} />
            </NavLink>
          )}
          {isAuthenticated && (currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
            <NavLink to="/admin/clubs" className={({ isActive }) => (isActive ? 'header-link active-link' : 'header-link')}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className={`header-controls ${menuOpen ? 'active' : ''}`}>
          <div className="header-language-selector">
            <LanguageSelector />
          </div>
          {isAuthenticated && currentUser ? (
            <div className="user-info">
              <NavLink to="/profile" className="profile-link">
                <TransliterableText text={t('welcomeUser', { name: currentUser.username || currentUser.role || 'User' }) || `Welcome, ${currentUser.username || currentUser.role || 'User'}!`} />
              </NavLink>
              <Button
                onClick={handleLogout}
                disabled={loadingAuth}
                className="button--secondary"
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
