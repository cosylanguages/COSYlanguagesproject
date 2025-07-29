// Import necessary libraries and components.
import React, { useEffect } from 'react';
// Import routing components from react-router-dom.
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// Import custom hooks for authentication and internationalization.
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
// Import layout and page components.
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StudyRoutes from './StudyRoutes';
import StudyModeGuard from './components/StudyMode/StudyModeGuard';
import MyStudySetsPage from './pages/MyStudySetsPage/MyStudySetsPage';
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import GamificationPage from './pages/GamificationPage/GamificationPage';
import PersonalizationPage from './pages/StudyMode/PersonalizationPage/PersonalizationPage';
import InteractivePage from './pages/StudyMode/InteractivePage/InteractivePage';
import StudyToolsPage from './pages/StudyMode/StudyToolsPage/StudyToolsPage';
import GrammarGuidebookPage from './pages/GrammarGuidebookPage/GrammarGuidebookPage';
import DictionaryPage from './pages/StudyMode/DictionaryPage/DictionaryPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ReviewPage from './pages/StudyMode/ReviewPage/ReviewPage';
import LearnedWordsPage from './pages/StudyMode/LearnedWordsPage/LearnedWordsPage';
import ConversationPage from './pages/StudyMode/ConversationPage/ConversationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Community from './pages/Community';

/**
 * A protected route component that checks for user authentication.
 * If the user is not authenticated, it redirects them to the login page.
 * It also displays a loading message while checking the authentication status.
 * @param {object} children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} The protected route component.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loadingAuth } = useAuth();
    const { t } = useI18n();

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * The main component that defines the application's routes.
 * It uses the `Routes` and `Route` components from `react-router-dom` to map URL paths to different components.
 * @returns {JSX.Element} The AppRoutes component.
 */
function AppRoutes() {
    return (
        <App />
    );
}

/**
 * The main App component that sets up a global navigation handler.
 * This allows other parts of the application to trigger navigation events.
 * @returns {JSX.Element} The App component.
 */
function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleNavigate = (event) => {
            navigate(event.detail);
        };

        window.addEventListener('navigateTo', handleNavigate);

        return () => {
            window.removeEventListener('navigateTo', handleNavigate);
        };
    }, [navigate]);

    return (
        <Routes>
            {/* The login page route. */}
            <Route path="/login" element={<Login />} />
            {/* The main layout route, which contains all other pages. */}
            <Route path="/" element={<Layout />}>
                {/* The landing page, which is the default page for the root URL. */}
                <Route index element={<LandingPage />} />
                {/* The freestyle mode page. */}
                <Route path="freestyle/*" element={<FreestyleModePage />} />
                {/* The gamification/progress page. */}
                <Route path="progress" element={<GamificationPage />} />
                {/* The personalization page. */}
                <Route path="personalize" element={<PersonalizationPage />} />
                {/* The interactive page. */}
                <Route path="interactive" element={<InteractivePage />} />
                {/* The study tools page. */}
                <Route path="study-tools" element={<StudyToolsPage />} />
                {/* The dictionary page. */}
                <Route path="dictionary" element={<DictionaryPage />} />
                {/* The grammar guidebooks page. */}
                <Route path="grammar-guidebooks" element={<GrammarGuidebookPage />} />
                {/* The study mode routes, which are protected by the StudyModeGuard. */}
                <Route path="study/*" element={<StudyModeGuard><StudyRoutes /></StudyModeGuard>} />
                {/* The review page. */}
                <Route path="review" element={<ReviewPage />} />
                {/* The learned words page, which is a protected route. */}
                <Route path="learned-words" element={<ProtectedRoute><LearnedWordsPage /></ProtectedRoute>} />
                {/* The conversation page. */}
                <Route path="conversation" element={<ConversationPage />} />
                {/* The profile page, which is a protected route. */}
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* The community page. */}
                <Route path="community" element={<Community />} />
                {/* The "my study sets" page, which is a protected route. */}
                <Route
                  path="my-sets"
                  element={
                    <ProtectedRoute>
                      <MyStudySetsPage />
                    </ProtectedRoute>
                  }
                >
                  {/* Nested routes for MyStudySetsPage can be added here if needed. */}
                </Route>
            </Route>
            {/* A catch-all route that redirects users to the appropriate page based on their authentication status. */}
            <Route path="*" element={<CatchAll />} />
        </Routes>
    );
}

/**
 * A component that handles catch-all routes.
 * It redirects authenticated users to the home page and unauthenticated users to the login page.
 * @returns {JSX.Element} The CatchAll component.
 */
function CatchAll() {
    return <Navigate to="/" replace />;
}

export default AppRoutes;
