// Import necessary libraries and components.
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import StudyModePage from './pages/StudyModePage/StudyModePage';
import MyStudySetsPage from './pages/MyStudySetsPage/MyStudySetsPage';
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import GamificationPage from './pages/GamificationPage/GamificationPage';
import PersonalizationPage from './pages/StudyMode/PersonalizationPage/PersonalizationPage';
import InteractivePage from './pages/StudyMode/InteractivePage/InteractivePage';
import StudyToolsPage from './pages/StudyMode/StudyToolsPage/StudyToolsPage';
import GrammarGuidebookPage from './pages/GrammarGuidebookPage/GrammarGuidebookPage';
import DictionaryPage from './pages/StudyMode/DictionaryPage/DictionaryPage';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ReviewPage from './pages/StudyMode/ReviewPage/ReviewPage';
import LearnedWordsPage from './pages/StudyMode/LearnedWordsPage/LearnedWordsPage';
import ConversationPage from './pages/StudyMode/ConversationPage/ConversationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Community from './pages/Community';
import ClubSelectionPage from './pages/ClubSelectionPage/ClubSelectionPage';
import SpeakingClub from './components/SpeakingClub';
import ClubsManager from './pages/Admin/ClubsManager';
import { Toaster } from 'react-hot-toast';
import LearnPage from './pages/LearnPage';
import PricingPage from './pages/PricingPage';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, loadingAuth, currentUser } = useAuth();
    const { t } = useI18n();

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(currentUser?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const Home = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <DashboardPage /> : <LandingPage />;
};

function AppRoutes() {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="freestyle/*" element={<FreestyleModePage />} />
                    <Route path="progress" element={<GamificationPage />} />
                    <Route path="grammar-guidebooks" element={<GrammarGuidebookPage />} />
                    <Route path="learn" element={<LearnPage />}>
                        <Route path="personalize" element={<PersonalizationPage />} />
                        <Route path="interactive" element={<InteractivePage />} />
                        <Route path="study-tools" element={<StudyToolsPage />} />
                        <Route path="dictionary" element={<DictionaryPage />} />
                        <Route path="study" element={<Navigate to="en" replace />} />
                        <Route path="study/:lang" element={<StudyModePage />} />
                        <Route path="review" element={<ReviewPage />} />
                        <Route path="learned-words" element={<ProtectedRoute><LearnedWordsPage /></ProtectedRoute>} />
                        <Route path="conversation" element={<ConversationPage />} />
                    </Route>
                    <Route path="profile" element={<ProtectedRoute roles={['user', 'admin']}><ProfilePage /></ProtectedRoute>} />
                    <Route path="community" element={<Community />} />
                    <Route path="speaking-club" element={<ClubSelectionPage />} />
                    <Route path="speaking-club/:eventId" element={<SpeakingClub />} />
                    <Route path="pricing" element={<PricingPage />} />
                    <Route
                        path="my-sets"
                        element={
                            <ProtectedRoute roles={['user', 'admin']}>
                                <MyStudySetsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="admin/clubs" element={<ProtectedRoute roles={['admin']}><ClubsManager /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
