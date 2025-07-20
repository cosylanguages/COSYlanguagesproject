import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { usePlan } from './contexts/PlanContext'; // Commented out as PlanOverview is commented
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StudyRoutes from './StudyRoutes';
// FreestyleModePage is no longer imported or used here
import MyStudySetsPage from './pages/MyStudySetsPage/MyStudySetsPage'; // Import MyStudySetsPage
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import GamificationPage from './pages/GamificationPage/GamificationPage';
import PersonalizationPage from './pages/PersonalizationPage/PersonalizationPage';
import InteractivePage from './pages/InteractivePage/InteractivePage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import StudyToolsPage from './pages/StudyToolsPage/StudyToolsPage';
import GrammarGuidebookPage from './pages/GrammarGuidebookPage/GrammarGuidebookPage';

// ProtectedRoute for general authentication (if needed for pages like MyStudySetsPage)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loadingAuth } = useAuth();
    const { t } = useI18n();

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function AppRoutes() {
    return (
        <App />
    );
}

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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/freestyle" replace />} />
                <Route path="freestyle/*" element={<FreestyleModePage />} />
                <Route path="progress" element={<GamificationPage />} />
                <Route path="personalize" element={<PersonalizationPage />} />
                <Route path="interactive" element={<InteractivePage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="study-tools" element={<StudyToolsPage />} />
                <Route path="grammar-guidebooks" element={<GrammarGuidebookPage />} />
                <Route path="study/*" element={<StudyRoutes />} />
                <Route
                  path="my-sets"
                  element={
                    <ProtectedRoute>
                      <MyStudySetsPage />
                    </ProtectedRoute>
                  }
                >
                  {/* Nested routes for MyStudySetsPage. MyStudySetsPage will need an <Outlet /> */}
                  {/* For now, MyStudySetsPage handles views internally. These are placeholders if we switch to full routing. */}
                  {/* <Route index element={<StudySetList />} /> */} {/* If StudySetList becomes a route child */}
                  {/* <Route path="new" element={<StudySetEditor mode="create" />} /> */}
                  {/* <Route path=":setId/edit" element={<StudySetEditor mode="edit" />} /> */}
                  {/* <Route path=":setId/cards" element={<FlashcardEditor />} /> */}
                  {/* <Route path=":setId/study" element={<FlashcardPlayer />} /> */}
                </Route>
            </Route>
            {/* Catch-all route */}
            <Route path="*" element={<CatchAll />} />
        </Routes>
    );
}

function CatchAll() {
    const { isAuthenticated, loadingAuth } = useAuth();
    const { t } = useI18n(); // For loading message translation

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    } else if (isAuthenticated) {
        // Authenticated users hitting an unknown SPA path go to the SPA root
        return <Navigate to="/" replace />;
    } else {
        // Unauthenticated users hitting an unknown SPA path go to the login page
        return <Navigate to="/login" replace />;
    }
}

export default AppRoutes;
