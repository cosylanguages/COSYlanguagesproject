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
