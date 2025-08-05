// Import necessary libraries and components.
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import Header from './Header';
import './Layout.css';

/**
 * The main layout component for the application.
 * It includes the header, navigation, main content area, and footer.
 * @returns {JSX.Element} The Layout component.
 */
const Layout = () => {
  const { t } = useI18n();

  // Render the layout component.
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
