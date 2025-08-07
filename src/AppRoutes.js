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
import Signup from './components/Auth/Signup';
import StudyModePage from '../content/pages/StudyModePage/StudyModePage';
import MyStudySetsPage from '../content/pages/MyStudySetsPage/MyStudySetsPage';
import FreestyleModePage from '../content/pages/FreestyleModePage/FreestyleModePage';
import GamificationPage from '../content/pages/GamificationPage/GamificationPage';
import PersonalizationPage from '../content/pages/StudyMode/PersonalizationPage/PersonalizationPage';
import InteractivePage from '../content/pages/StudyMode/InteractivePage/InteractivePage';
import StudyToolsPage from '../content/pages/StudyMode/StudyToolsPage/StudyToolsPage';
import GrammarGuidebookPage from '../content/pages/GrammarGuidebookPage/GrammarGuidebookPage';
import DictionaryPage from '../content/pages/StudyMode/DictionaryPage/DictionaryPage';
import ToolsPage from '../content/pages/ToolsPage/ToolsPage';
import Calculator from '../content/pages/CalculatorPage/Calculator';
import PersonalizedDashboard from './components/PersonalizedDashboard';
import ReviewPage from '../content/pages/StudyMode/ReviewPage/ReviewPage';
import LearnedWordsPage from '../content/pages/StudyMode/LearnedWordsPage/LearnedWordsPage';
import ConversationPage from '../content/pages/StudyMode/ConversationPage/ConversationPage';
import ProfilePage from '../content/pages/ProfilePage/ProfilePage';
import Settings from '../content/pages/ProfilePage/Settings';
import Community from '../content/pages/Community';
import ClubSelectionPage from '../content/pages/ClubSelectionPage/ClubSelectionPage';
import SpeakingClub from './components/SpeakingClub';
import ClubsManager from '../content/pages/Admin/ClubsManager';
import { Toaster } from 'react-hot-toast';
import LearnPage from '../content/pages/LearnPage';
import PricingPage from '../content/pages/PricingPage';

/**
 * A protected route component that checks for user authentication.
 * If the user is not authenticated, it redirects them to the login page.
 * It also displays a loading message while checking the authentication status.
 * @param {object} children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} The protected route component.
 */
const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, loadingAuth, currentUser, isGuest } = useAuth();
    const { t } = useI18n();

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isGuest && roles) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(currentUser?.role)) {
        return <Navigate to="/" replace />; // Or a dedicated "unauthorized" page
    }

    return children;
};

/**
 * The main component that defines the application's routes.
 * It uses the `Routes` and `Route` components from `react-router-dom` to map URL paths to different components.
 * @returns {JSX.Element} The AppRoutes component.
 */
function AppRoutes() {
    return (
        <>
            <Toaster />
            <App />
        </>
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
            {/* The signup page route. */}
            <Route path="/signup" element={<Signup />} />
            {/* The main layout route, which contains all other pages. */}
            <Route path="/" element={<Layout />}>
                {/* The landing page, which is the default page for the root URL. */}
                <Route index element={<PersonalizedDashboard />} />
                {/* The freestyle mode page. */}
                <Route path="freestyle/*" element={<FreestyleModePage />} />
                {/* The gamification/progress page. */}
                <Route path="progress" element={<GamificationPage />} />
                {/* The grammar guidebooks page. */}
                {/* The new tools routes */}
                <Route path="tools" element={<ToolsPage />} />
                <Route path="tools/grammar" element={<GrammarGuidebookPage />} />
                <Route path="tools/dictionary" element={<DictionaryPage />} />
                <Route path="tools/calculator" element={<Calculator />} />
                {/* The new study route */}
                <Route path="study" element={<Navigate to="en" replace />} />
                <Route path="study/:lang" element={<StudyModePage />} />
                {/* The profile page, which is a protected route. */}
                <Route path="profile" element={<ProtectedRoute roles={['user', 'admin']}><ProfilePage /></ProtectedRoute>} />
                <Route path="profile/settings" element={<ProtectedRoute roles={['user', 'admin']}><Settings /></ProtectedRoute>} />
                {/* The community page. */}
                <Route path="community" element={<Community />} />
                {/* The Speaking Club pages. */}
                <Route path="speaking-club" element={<ClubSelectionPage />} />
                <Route path="speaking-club/:eventId" element={<SpeakingClub />} />
                {/* The "my study sets" page, which is a protected route. */}
                <Route
                  path="my-sets"
                  element={
                    <ProtectedRoute roles={['user', 'admin']}>
                      <MyStudySetsPage />
                    </ProtectedRoute>
                  }
                >
                  {/* Nested routes for MyStudySetsPage can be added here if needed. */}
                </Route>
                {/* Admin Routes */}
                <Route path="admin/clubs" element={<ProtectedRoute roles={['admin']}><ClubsManager /></ProtectedRoute>} />
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
