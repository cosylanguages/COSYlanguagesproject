// Import necessary libraries and components.
// React and ReactDOM are the core of the React application.
import React from 'react';
import ReactDOM from 'react-dom/client';
// BrowserRouter is used for routing within the application.
import { BrowserRouter } from 'react-router-dom';
// createTheme and ThemeProvider from Material-UI are used for theming.
import { createTheme, ThemeProvider } from '@mui/material/styles';
// AppRoutes is the main component that defines all the application routes.
import AppRoutes from './AppRoutes';
// Context providers are used to manage global state.
// PlanProvider manages the user's study plan.
import { PlanProvider } from './contexts/PlanContext';
// AuthProvider manages user authentication.
import { AuthProvider } from './contexts/AuthContext';
// I18nProvider manages internationalization and translations.
import { I18nProvider } from './i18n/I18nContext';
// LatinizationProvider manages transliteration of text.
import { LatinizationProvider } from './contexts/LatinizationContext';
// UserProfileProvider manages the user's profile data.
import { UserProfileProvider } from './contexts/UserProfileContext'; // Added UserProfileProvider
// FreestyleProvider manages the state for the "freestyle" learning mode.
import { FreestyleProvider } from './contexts/FreestyleContext';
// StudyProvider manages the state for the "study" learning mode.
import { StudyProvider } from './contexts/StudyContext';
// StudySetProvider manages user-created study sets.
import { StudySetProvider } from './contexts/StudySetContext';
// Import global CSS files.
import './index.css';
import './styles/global.css';
import './components/Common/animations.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create a default Material-UI theme.
const theme = createTheme();

// Get the root element from the HTML file.
const rootElement = document.getElementById('root');

// If the root element exists, render the application.
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // Render the application within React.StrictMode to highlight potential problems.
  root.render(
    <React.StrictMode>
      {/* BrowserRouter provides routing capabilities to the application. */}
      {/* The basename is set to the project's subdirectory on the server. */}
      <BrowserRouter basename="/COSYlanguagesproject">
        {/* I18nProvider provides translation capabilities to the application. */}
        <I18nProvider>
          {/* LatinizationProvider provides transliteration capabilities. */}
          <LatinizationProvider>
            {/* AuthProvider manages user authentication state. */}
            <AuthProvider>
              {/* UserProfileProvider manages user profile data. */}
              <UserProfileProvider>
                {/* PlanProvider manages the user's study plan. */}
                <PlanProvider>
                  {/* FreestyleProvider manages the state for the "freestyle" learning mode. */}
                  <FreestyleProvider>
                    {/* StudyProvider manages the state for the "study" learning mode. */}
                    <StudyProvider>
                      {/* StudySetProvider manages user-created study sets. */}
                      <StudySetProvider>
                        {/* ThemeProvider applies the Material-UI theme to the application. */}
                        <ThemeProvider theme={theme}>
                          {/* AppRoutes contains all the application's routes. */}
                          <AppRoutes />
                        </ThemeProvider>
                      </StudySetProvider>
                    </StudyProvider>
                  </FreestyleProvider>
                </PlanProvider>
              </UserProfileProvider>
            </AuthProvider>
          </LatinizationProvider>
        </I18nProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  // If the root element is not found, log an error to the console.
  console.error("Failed to find the root element. Please ensure your HTML file has a <div id='root'></div>.");
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
