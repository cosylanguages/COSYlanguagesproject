import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudyModePage from './pages/StudyModePage/StudyModePage';

function StudyRoutes() {
    return (
        <BrowserRouter basename="/COSYlanguagesproject/study">
            <Routes>
                <Route path="/" element={<Navigate to="/en" replace />} />
                <Route path="/:lang" element={<StudyModePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default StudyRoutes;
