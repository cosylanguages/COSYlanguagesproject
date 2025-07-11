import React, { useState } from 'react'; // Removed useEffect
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { usePlan } from './contexts/PlanContext'; // Commented out as PlanOverview is commented
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StudyModePage from './pages/StudyModePage/StudyModePage';
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import MyStudySetsPage from './pages/MyStudySetsPage/MyStudySetsPage'; // Import MyStudySetsPage
import ShowWordExercise from './components/Freestyle/exercises/vocabulary/ShowWordExercise';
import PinModal from './components/Common/PinModal';

const STUDY_MODE_PIN = "1234";

// StudyModeProtectedRoute component (for PIN access)
const StudyModeProtectedRoute = ({ children }) => {
    const [isPinVerified, setIsPinVerified] = useState(sessionStorage.getItem('studyModeUnlocked') === 'true');
    const [showPinModal, setShowPinModal] = useState(!isPinVerified);
    const [pinError, setPinError] = useState('');
    const navigate = useNavigate();
    const { t } = useI18n();

    const handlePinSubmit = (pin) => {
        if (pin === STUDY_MODE_PIN) {
            sessionStorage.setItem('studyModeUnlocked', 'true');
            setIsPinVerified(true);
            setShowPinModal(false);
            setPinError('');
        } else {
            setPinError('Incorrect PIN. Please try again.');
        }
    };

    const handleModalClose = () => {
        setShowPinModal(false);
        navigate('/');
    }

    if (isPinVerified) {
        return children;
    }

    if (showPinModal) {
        return <PinModal onSubmit={handlePinSubmit} onClose={handleModalClose} error={t('auth.incorrectPin', pinError)} />;
    }

    return <Navigate to="/" replace />;
};

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
    const { isAuthenticated } = useAuth(); // Used for the catch-all route

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<FreestyleModePage />} />
                <Route path="freestyle" element={<FreestyleModePage />} />
                <Route
                  path="study"
                  element={
                    <StudyModeProtectedRoute>
                      <StudyModePage />
                    </StudyModeProtectedRoute>
                  }
                />
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
                {/* Temp route for testing ShowWordExercise */}
                <Route path="study/random-word" element={<ShowWordExercise />} />
            </Route>
            {/* Catch-all route */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;
