// src/components/Layout/CosyHeader.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import UserMenu from './UserMenu';
import Button from '../Common/Button';
import './CosyHeader.css';

const CosyHeader = () => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const { t } = useI18n();

  return (
    <header className="cosy-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src={`${process.env.PUBLIC_URL}/assets/icons/cosylanguages_logos/cosylanguages.png`} alt="Cosy Languages Logo" />
          <span>COSYlanguages</span>
        </Link>
        <input id="menu-toggle" type="checkbox" />
        <label className="menu-toggle" htmlFor="menu-toggle">
          ☰
        </label>
        <nav id="main-nav" className="header-nav">
            <NavLink to="/learn" className="nav-link">Learn</NavLink>
            <NavLink to="/freestyle" className="nav-link">Freestyle</NavLink>
            <NavLink to="/community" className="nav-link">Community</NavLink>
            <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
        </nav>
        <div className="header-controls">
          <div className="header-language-selector">
            <LanguageSelector />
          </div>
          {isAuthenticated ? (
            <UserMenu />
          ) : !loadingAuth && (
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
            >
              {t('btnLogin') || 'Login'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CosyHeader;
