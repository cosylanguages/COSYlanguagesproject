// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import './Layout.css';

// An array of navigation links.
const navLinks = [
  { to: '/freestyle', text: 'navFreestyle', defaultText: 'Freestyle' },
  { to: '/flashcards', text: 'navFlashcards', defaultText: 'Flashcards' },
  { to: '/study', text: 'navStudyMode', defaultText: 'Study' },
  { to: '/progress', text: 'navProgress', defaultText: 'Progress' },
  { to: '/community', text: 'navCommunity', defaultText: 'Community' },
];

/**
 * The main layout component for the application.
 * It includes the header, navigation, main content area, and footer.
 * @returns {JSX.Element} The Layout component.
 */
const Layout = () => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Check if the user is in "study mode".
  const isStudyMode = location.pathname.startsWith('/study');

  // An array of navigation links for "study mode".
  const studyModeNavLinks = [
    { to: '/study/dictionary', text: 'navDictionary', defaultText: 'Dictionary' },
    { to: '/study/study-tools', text: 'navStudyTools', defaultText: 'Study Tools' },
    { to: '/study/conversation', text: 'navConversation', defaultText: 'Conversation' },
    { to: '/study/learned-words', text: 'navLearnedWords', defaultText: 'Learned Words' },
    { to: '/study/review', text: 'navReview', defaultText: 'Review' },
    { to: '/study/personalize', text: 'navPersonalize', defaultText: 'Personalize' },
    { to: '/study/interactive', text: 'navInteractive', defaultText: 'Interactive' },
  ];

  // Combine the navigation links based on the current mode.
  const filteredNavLinks = isStudyMode
    ? [...navLinks, ...studyModeNavLinks]
    : navLinks;

  // Effect to toggle dark mode.
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  /**
   * Toggles dark mode.
   */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  /**
   * Handles the logout process.
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Render the layout component.
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
            {filteredNavLinks.map((link) => (
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
            onClick={toggleDarkMode}
            variant="contained"
            color="secondary"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button
            onClick={() => {
              alert('Downloading the app...');
            }}
            variant="contained"
            color="primary"
          >
            {t('btnDownload') || 'Download App'}
          </Button>
          {isAuthenticated && currentUser && (
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
