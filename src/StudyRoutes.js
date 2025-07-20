import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudyModePage from './pages/StudyModePage/StudyModePage';

function StudyRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="en" replace />} />
            <Route path=":lang" element={<StudyModePage />} />
        </Routes>
    );
}

export default StudyRoutes;
