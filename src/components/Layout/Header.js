// src/components/Layout/Header.js
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import UserMenu from './UserMenu';
import ToolsMenu from './ToolsMenu';
import './Header.css';

const Header = () => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <ToolsMenu />
        </nav>
        <div className={`header-controls ${menuOpen ? 'active' : ''}`}>
          <div className="header-language-selector">
            <LanguageSelector />
          </div>
          {isAuthenticated ? (
            <UserMenu />
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
