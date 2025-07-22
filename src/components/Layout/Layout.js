import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import './Layout.css';

const navLinks = [
  { to: '/freestyle', text: 'navFreestyle', defaultText: 'Freestyle' },
  { to: '/study', text: 'navStudyMode', defaultText: 'Study' },
  { to: '/progress', text: 'navProgress', defaultText: 'Progress' },
  { to: '/personalize', text: 'navPersonalize', defaultText: 'Personalize' },
  { to: '/interactive', text: 'navInteractive', defaultText: 'Interactive' },
  { to: '/community', text: 'navCommunity', defaultText: 'Community' },
  { to: '/study-tools', text: 'navStudyTools', defaultText: 'Study Tools' },
  { to: '/review', text: 'navReview', defaultText: 'Review' },
  { to: '/learned-words', text: 'navLearnedWords', defaultText: 'Learned Words' },
];

const Layout = () => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-title-area">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1><TransliterableText text={t('mainHeading') || 'COSYlanguages'} /></h1>
          </Link>
        </div>
        <nav className="app-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => isActive ? "active-link" : ""}>
                  <TransliterableText text={t(link.text) || link.defaultText} />
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink to="/my-sets" className={({ isActive }) => isActive ? "active-link" : ""}>
                  <TransliterableText text={t('navMyStudySets') || 'My Sets'} />
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="header-controls">
          <Button
            onClick={() => {
              alert('Downloading the app...');
            }}
            className="download-button"
            variant="primary"
          >
            <TransliterableText text={t('btnDownload') || 'Download App'} />
          </Button>
          {isAuthenticated && currentUser && (
            <div className="user-info">
              <span><TransliterableText text={t('welcomeUser', { name: currentUser.username || currentUser.role || 'User' }) || `Welcome, ${currentUser.username || currentUser.role || 'User'}!`} /></span>
              <Button
                onClick={handleLogout}
                disabled={loadingAuth}
                className="logout-button"
                variant="danger"
              >
                <TransliterableText text={loadingAuth ? (t('loggingOut') || 'Logging out...') : (t('btnLogout') || 'Logout')} />
              </Button>
            </div>
          )}
          {!isAuthenticated && !loadingAuth && (
            <NavLink to="/login" className={({ isActive }) => isActive ? "active-link login-link" : "login-link"}>
              <TransliterableText text={t('btnLogin') || 'Login'} />
            </NavLink>
          )}
        </div>
      </header>
      <main className="app-main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} <TransliterableText text={t('mainHeading') || 'COSYlanguages'} /></p>
      </footer>
    </div>
  );
};

export default Layout;
