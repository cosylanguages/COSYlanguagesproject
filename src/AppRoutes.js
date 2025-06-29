import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { usePlan } from './PlanContext';
import { useAuth } from './AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StudyModePage from './pages/StudyModePage/StudyModePage';
import FreestyleModePage from './pages/FreestyleModePage/FreestyleModePage';
import ShowWordExercise from './components/Freestyle/exercises/vocabulary/ShowWordExercise'; // Corrected import
import PinModal from './components/Common/PinModal'; // Import PinModal

const STUDY_MODE_PIN = "1234"; // Define the PIN

// Component for the Plan Overview
const PlanOverview = () => {
    const { plan, fetchPlan, loading, error } = usePlan();
    const { authToken, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && authToken) {
            fetchPlan(authToken);
        }
    }, [authToken, isAuthenticated, fetchPlan]);

    const daysExist = plan && plan.days && Array.isArray(plan.days);
    const studySetsExist = plan && plan.studySets && Array.isArray(plan.studySets);

    if (!isAuthenticated) {
        return (
            <div>
                <h2>Plan Data</h2>
                <p><em>Please log in to view plan data.</em></p>
            </div>
        );
    }

    if (loading) {
        return <div><h2>Plan Data</h2><p><em>Loading plan data...</em></p></div>;
    }

    if (error) {
        return <div><h2>Plan Data</h2><p style={{color: 'red'}}><em>Error fetching plan: {error}</em></p></div>;
    }

    return (
        <div>
            <h2>Current Plan Data (from Backend)</h2>
            
            {(daysExist && plan.days.length > 0) || (studySetsExist && plan.studySets.length > 0) ? (
                <>
                    {daysExist && plan.days.length > 0 && (
                        <>
                            <h3>Days</h3>
                            <ul>
                                {plan.days.map(day => (
                                    <li key={day.id}>
                                        <strong>{day.title?.COSYenglish || day.title?.default || day.title || `Day ${day.id}`}</strong>
                                        {day.sections && day.sections.length > 0 && (
                                            <ul>
                                                {day.sections.map(section => (
                                                    <li key={section.id}>
                                                        {section.title?.COSYenglish || section.title?.default || section.title || `Section ${section.id}`}
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
                            <h3>Study Sets</h3>
                            <ul>
                                {plan.studySets.map(set => (
                                    <li key={set.id}>
                                        {set.name || set.title || `Set ${set.id}`} ({set.itemCount} items)
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            ) : (
                <p><em>No plan data available for this user, or data is empty.</em></p>
            )}
        </div>
    );
};

// ProtectedRoute component (for general auth)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loadingAuth } = useAuth();
    if (loadingAuth) {
        return <div>Loading authentication status...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// StudyModeProtectedRoute component (for PIN access)
const StudyModeProtectedRoute = ({ children }) => {
    const [isPinVerified, setIsPinVerified] = useState(sessionStorage.getItem('studyModeUnlocked') === 'true');
    const [showPinModal, setShowPinModal] = useState(!isPinVerified);
    const [pinError, setPinError] = useState('');
    const navigate = useNavigate();

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
        return <PinModal onSubmit={handlePinSubmit} onClose={handleModalClose} error={pinError} />;
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
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<PlanOverview />} />
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
