import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { PlanProvider } from './contexts/PlanContext';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './i18n/I18nContext';
import { LatinizationProvider } from './contexts/LatinizationContext';
import { UserProfileProvider } from './contexts/UserProfileContext'; // Added UserProfileProvider
import './index.css'; 

// --- SPA Redirect Logic for GitHub Pages ---
// This checks if the URL has a `p` query parameter, which our 404.html page sets.
// If it does, it rewrites the URL to the correct path and replaces the history state.
// This allows React Router to handle routes correctly on refresh or direct navigation.
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
if (redirectPath) {
  const newUrl = window.location.pathname.replace(/\/?$/, '') + redirectPath + window.location.hash;
  window.history.replaceState(null, '', newUrl);
}
// --- End of SPA Redirect Logic ---

const rootElement = document.getElementById('root');
const isProd = process.env.NODE_ENV === 'production';

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {isProd ? (
        <BrowserRouter basename="/COSYlanguagesproject">
          <I18nProvider>
            <LatinizationProvider>
              <AuthProvider>
                <UserProfileProvider>
                    <PlanProvider>
                      <AppRoutes /> 
                    </PlanProvider>
                </UserProfileProvider>
              </AuthProvider>
            </LatinizationProvider>
          </I18nProvider>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <I18nProvider>
            <LatinizationProvider>
              <AuthProvider>
                <UserProfileProvider>
                    <PlanProvider>
                      <AppRoutes /> 
                    </PlanProvider>
                </UserProfileProvider>
              </AuthProvider>
            </LatinizationProvider>
          </I18nProvider>
        </BrowserRouter>
      )}
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Please ensure your HTML file has a <div id='root'></div>.");
}
