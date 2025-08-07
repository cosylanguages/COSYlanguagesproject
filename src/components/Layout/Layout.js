// Import necessary libraries and components.
import React from 'react';
import { Outlet } from 'react-router-dom';
import CosyHeader from './CosyHeader';
import './Layout.css';

/**
 * The main layout component for the application.
 * It includes the header, navigation, main content area, and footer.
 * @returns {JSX.Element} The Layout component.
 */
const Layout = () => {
  // Render the layout component.
  return (
    <div className="app-layout">
      <CosyHeader />
      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
