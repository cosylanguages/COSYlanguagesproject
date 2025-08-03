import React from 'react';
import Header from './Header';

const StudyLayout = ({ children }) => {
    return (
        <div className="study-layout">
            <Header />
            <div className="study-layout-body">
                <main className="study-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudyLayout;
