import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to COSYlanguages</h1>
        <p>Your journey to language mastery starts here.</p>
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">Start a Lesson</Link>
          <Link to="/login" className="landing-button">Create an Account / Login</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
