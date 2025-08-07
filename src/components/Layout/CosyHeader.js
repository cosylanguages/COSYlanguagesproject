// src/components/Layout/CosyHeader.js
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import UserMenu from './UserMenu';
import './CosyHeader.css';

const CosyHeader = () => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="cosy-header">
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
            <NavLink to="/learn" className="nav-link">Learn</NavLink>
            <NavLink to="/freestyle" className="nav-link">Freestyle</NavLink>
            <NavLink to="/community" className="nav-link">Community</NavLink>
            <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
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

export default CosyHeader;
