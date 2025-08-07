import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav className="main-nav">
            <NavLink to="/freestyle" className="nav-link">Freestyle</NavLink>
            <NavLink to="/study" className="nav-link">Study</NavLink>
            <NavLink to="/community" className="nav-link">Community</NavLink>
        </nav>
    );
};

export default Navigation;
