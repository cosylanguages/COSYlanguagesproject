import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const [learnMenuOpen, setLearnMenuOpen] = useState(false);

    const toggleLearnMenu = () => {
        setLearnMenuOpen(!learnMenuOpen);
    };

    return (
        <nav className="main-nav">
            <div className="nav-item" onMouseEnter={toggleLearnMenu} onMouseLeave={toggleLearnMenu}>
                <button className="nav-link">Learn</button>
                {learnMenuOpen && (
                    <div className="dropdown-menu">
                        <NavLink to="/learn/study" className="dropdown-link">Study Mode</NavLink>
                        <NavLink to="/learn/personalize" className="dropdown-link">Personalize</NavLink>
                        <NavLink to="/learn/interactive" className="dropdown-link">Interactive</NavLink>
                        <NavLink to="/learn/study-tools" className="dropdown-link">Study Tools</NavLink>
                        <NavLink to="/learn/dictionary" className="dropdown-link">Dictionary</NavLink>
                        <NavLink to="/learn/review" className="dropdown-link">Review</NavLink>
                        <NavLink to="/learn/learned-words" className="dropdown-link">Learned Words</NavLink>
                        <NavLink to="/learn/conversation" className="dropdown-link">Conversation</NavLink>
                    </div>
                )}
            </div>
            <NavLink to="/freestyle" className="nav-link">Freestyle</NavLink>
            <NavLink to="/community" className="nav-link">Community</NavLink>
            <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
            <NavLink to="/grammar-guidebooks" className="nav-link">Grammar</NavLink>
        </nav>
    );
};

export default Navigation;
