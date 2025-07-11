import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { useI18n } from '../../i18n/I18nContext'; // Import useI18n
import Button from '../Common/Button'; // Import Button
import TransliterableText from '../Common/TransliterableText';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const { t, language } = useI18n(); // Get translation function
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirect to login after logout
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
            <li>
              {/* Changed NavLink to <a> for Home, pointing to freestyle.html */}
              <a href="/freestyle.html" className={window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/freestyle.html') ? "active-link" : ""}><TransliterableText text={t('navHome') || 'Home'} /></a>
            </li>
            <li>
              {/* Changed NavLink to <a> for Freestyle, pointing to freestyle.html */}
              <a href="/freestyle.html" className={window.location.pathname.endsWith('/freestyle.html') ? "active-link" : ""}><TransliterableText text={t('navFreestyle') || 'Freestyle'} /></a>
            </li>
            <li>
              <NavLink to="/study" className={({ isActive }) => isActive ? "active-link" : ""}><TransliterableText text={t('navStudyMode') || 'Study'} /></NavLink>
            </li>
            <li>
              <NavLink to={`/study/irregular-verbs?variety=${language}`} className={({ isActive }) => isActive ? "active-link" : ""}><TransliterableText text={t('navIrregularVerbs') || 'Irregular Verbs'} /></NavLink>
            </li>
            {isAuthenticated && ( // Only show "My Sets" if authenticated
              <li>
                <NavLink to="/my-sets" className={({ isActive }) => isActive ? "active-link" : ""}><TransliterableText text={t('navMyStudySets') || 'My Sets'} /></NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="header-controls">
          {isAuthenticated && currentUser && (
            <div className="user-info">
              <span><TransliterableText text={t('welcomeUser', { name: currentUser.username || currentUser.role || 'User' }) || `Welcome, ${currentUser.username || currentUser.role || 'User'}!`} /></span>
              <Button
                onClick={handleLogout}
                disabled={loadingAuth}
                className="logout-button" // Keep for any specific layout adjustments if needed
                variant="danger" // Using danger variant for logout
              >
                <TransliterableText text={loadingAuth ? (t('loggingOut') || 'Logging out...') : (t('btnLogout') || 'Logout')} />
              </Button>
            </div>
          )}
          {!isAuthenticated && !loadingAuth && (
            <NavLink to="/login" className={({ isActive }) => isActive ? "active-link login-link" : "login-link"}><TransliterableText text={t('btnLogin') || 'Login'} /></NavLink>
          )}
        </div>
      </header>
      <main className="app-main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} <TransliterableText text={t('mainHeading') || 'COSYlanguages'} /></p>
      </footer>
    </div>
  );
};

export default Layout;
