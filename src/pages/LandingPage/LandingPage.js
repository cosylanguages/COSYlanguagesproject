import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// The main landing page for the application.
// It displays the logo and navigation buttons to different modes.
function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Logo of the application */}
        <img src="/cosylanguages.png" alt="Cosy Languages Logo" className="logo" />
        {/* Navigation buttons */}
        <div className="landing-buttons">
          {/* Link to Freestyle mode */}
          <Link to="/freestyle" className="landing-button">Freestyle</Link>
          {/* Link to Study mode */}
          <Link to="/study" className="landing-button">Study Mode</Link>
          {/* Link to Community mode */}
          <Link to="/community" className="landing-button">Community</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
