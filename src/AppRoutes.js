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
import GrammarGuidebookPage from './pages/GrammarGuidebookPage/GrammarGuidebookPage';
import DictionaryPage from './pages/StudyMode/DictionaryPage/DictionaryPage';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Community from './pages/Community';
import ClubSelectionPage from './pages/ClubSelectionPage/ClubSelectionPage';
import SpeakingClub from './components/SpeakingClub';
import ClubsManager from './pages/Admin/ClubsManager';
import { Toaster } from 'react-hot-toast';
import CalculatorPage from './pages/CalculatorPage/Calculator';
import StudyModeGuard from './components/StudyMode/StudyModeGuard';
import { usePictureDictionary } from './contexts/PictureDictionaryContext';
import PictureDictionary from './components/Common/PictureDictionary';

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
    const { isModalOpen, selectedWord, closeModal } = usePictureDictionary();
    return (
        <>
            <Toaster />
            {isModalOpen && <PictureDictionary word={selectedWord} onClose={closeModal} />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                    {/* Core Features */}
                    <Route path="freestyle/*" element={<FreestyleModePage />} />
                    <Route path="community" element={<Community />} />
                    <Route path="speaking-club" element={<ClubSelectionPage />} />
                    <Route path="speaking-club/:eventId" element={<SpeakingClub />} />

                    {/* Study Mode */}
                    <Route path="study" element={<Navigate to="en" replace />} />
                    <Route path="study/:lang" element={<StudyModeGuard><StudyModePage /></StudyModeGuard>}>
                        {/* Sub-routes for the unified dashboard can be defined here if needed */}
                    </Route>

                    {/* User Menu Routes */}
                    <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="my-sets" element={<ProtectedRoute><MyStudySetsPage /></ProtectedRoute>} />
                    <Route path="progress" element={<ProtectedRoute><GamificationPage /></ProtectedRoute>} />

                    {/* Tools Section */}
                    <Route path="tools/grammar" element={<GrammarGuidebookPage />} />
                    <Route path="tools/dictionary" element={<DictionaryPage />} />
                    <Route path="tools/calculator" element={<CalculatorPage />} />

                    {/* Admin Routes */}
                    <Route path="admin/clubs" element={<ProtectedRoute roles={['admin']}><ClubsManager /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
