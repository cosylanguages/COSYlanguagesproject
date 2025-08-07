import React from 'react';
import { Link } from 'react-router-dom';
import './ToolsPage.css';

const ToolsPage = () => {
    return (
        <div className="tools-page">
            <h1>Tools</h1>
            <div className="tools-grid">
                <Link to="/tools/grammar" className="tool-card">
                    <h2>Grammar Guidebook</h2>
                    <p>Explore grammar rules and examples.</p>
                </Link>
                <Link to="/tools/dictionary" className="tool-card">
                    <h2>Dictionary</h2>
                    <p>Look up words and phrases.</p>
                </Link>
                <Link to="/tools/calculator" className="tool-card">
                    <h2>Language Calculator</h2>
                    <p>Perform language-related calculations.</p>
                </Link>
            </div>
        </div>
    );
};

export default ToolsPage;
