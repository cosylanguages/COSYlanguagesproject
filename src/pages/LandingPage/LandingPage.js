// Import necessary libraries and components.
import React from 'react';
// Import the Link component from react-router-dom for navigation.
import { Link } from 'react-router-dom';
// Import the CSS for this component.
import './LandingPage.css';

/**
 * The main landing page for the application.
 * It serves as the entry point for users, displaying the application's logo
 * and providing navigation to the main sections of the app: Freestyle, Study Mode, and Community.
 * @returns {JSX.Element} The LandingPage component.
 */
function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* The logo of the application. */}
        <img src="/cosylanguages.png" alt="Cosy Languages Logo" className="logo" />
        {/* A container for the navigation buttons. */}
        <div className="landing-buttons">
          {/* A link to the Freestyle mode page. */}
          <Link to="/freestyle" className="landing-button">Freestyle</Link>
          {/* A link to the Study mode page. */}
          <Link to="/study" className="landing-button">Study Mode</Link>
          {/* A link to the Community page. */}
          <Link to="/community" className="landing-button">Community</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
