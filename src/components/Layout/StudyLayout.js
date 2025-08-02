import React from 'react';
import StudyHeader from './StudyHeader';
import Sidebar from './Sidebar';

const StudyLayout = ({ children }) => {
    return (
        <div className="study-layout">
            <StudyHeader />
            <div className="study-layout-body">
                <Sidebar />
                <main className="study-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudyLayout;
