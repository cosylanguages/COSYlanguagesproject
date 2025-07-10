import React, { useState } from 'react'; // Removed useEffect
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { usePlan } from './contexts/PlanContext'; // Commented out as PlanOverview is commented
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './i18n/I18nContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StudyModePage from './pages/StudyModePage/StudyModePage';
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import ShowWordExercise from './components/Freestyle/exercises/vocabulary/ShowWordExercise'; // Corrected import
import PinModal from './components/Common/PinModal'; // Import PinModal

const STUDY_MODE_PIN = "1234"; // Define the PIN

/*
// Component for the Plan Overview
const PlanOverview = () => {
    const { t, language } = useI18n();
    const { plan, fetchPlan, loading, error } = usePlan(); // usePlan would be undefined here
    const { authToken, isAuthenticated } = useAuth();

    useEffect(() => { // This useEffect is part of the commented out PlanOverview
        if (isAuthenticated && authToken) {
            fetchPlan(authToken);
        }
    }, [authToken, isAuthenticated, fetchPlan]);

    const daysExist = plan && plan.days && Array.isArray(plan.days);
    const studySetsExist = plan && plan.studySets && Array.isArray(plan.studySets);

    if (!isAuthenticated) {
        return (
            <div>
                <h2>{t('planData.heading', 'Plan Data')}</h2>
                <p><em>{t('planData.loginPrompt', 'Please log in to view plan data.')}</em></p>
            </div>
        );
    }

    if (loading) {
        return <div><h2>{t('planData.heading', 'Plan Data')}</h2><p><em>{t('planData.loading', 'Loading plan data...')}</em></p></div>;
    }

    if (error) {
        return <div><h2>{t('planData.heading', 'Plan Data')}</h2><p style={{color: 'red'}}><em>{t('planData.error', 'Error fetching plan: {error}', { error })}</em></p></div>;
    }

    return (
        <div>
            <h2>{t('planData.currentHeading', 'Current Plan Data (from Backend)')}</h2>
            {(daysExist && plan.days.length > 0) || (studySetsExist && plan.studySets.length > 0) ? (
                <>
                    {daysExist && plan.days.length > 0 && (
                        <>
                            <h3>{t('planData.days', 'Days')}</h3>
                            <ul>
                                {plan.days.map(day => (
                                    <li key={day.id}>
                                        <strong>{day.title?.[language] || day.title?.COSYenglish || day.title?.default || day.title || t('planData.day', `Day ${day.id}`)}</strong>
                                        {day.sections && day.sections.length > 0 && (
                                            <ul>
                                                {day.sections.map(section => (
                                                    <li key={section.id}>
                                                        {section.title?.[language] || section.title?.COSYenglish || section.title?.default || section.title || t('planData.section', `Section ${section.id}`)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {studySetsExist && plan.studySets.length > 0 && (
                        <>
                            <h3>{t('planData.studySets', 'Study Sets')}</h3>
                            <ul>
                                {plan.studySets.map(set => (
                                    <li key={set.id}>
                                        {set.name || set.title || t('planData.set', `Set ${set.id}`)} ({set.itemCount} {t('planData.items', 'items')})
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            ) : (
                <p><em>{t('planData.noData', 'No plan data available for this user, or data is empty.')}</em></p>
            )}
        </div>
    );
};
*/

/*
// ProtectedRoute component (for general auth)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loadingAuth } = useAuth();
    const { t } = useI18n();

    if (loadingAuth) {
        return <div>{t('auth.loadingStatus', 'Loading authentication status...')}</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};
*/

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
        navigate('/'); // Navigate away if user closes modal without verifying
    }

    if (isPinVerified) {
        return children;
    }

    if (showPinModal) {
        return <PinModal onSubmit={handlePinSubmit} onClose={handleModalClose} error={t('auth.incorrectPin', pinError)} />;
    }
    
    // Fallback, should ideally not be reached if logic is correct
    // but ensures we don't render children if not verified and modal not shown.
    return <Navigate to="/" replace />; 
};


function AppRoutes() {
    const { isAuthenticated } = useAuth();

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
                {/* Temp route for testing ShowWordExercise (formerly RandomWordExercise) */}
                <Route path="study/random-word" element={<ShowWordExercise />} /> 
            </Route>
            <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;
