// Import necessary libraries and components.
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
// Import the CSS for this component.
import './LandingPage.css';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';

/**
 * The main landing page for the application.
 * It serves as the entry point for users, displaying the application's logo
 * and providing navigation to the main sections of the app: Freestyle, Study Mode, and Community.
 * @returns {JSX.Element} The LandingPage component.
 */
function LandingPage() {
  // Ref pour la zone d'accueil (pour positionner les confettis)
  const landingContentRef = useRef(null);


  return (
    <div className="landing-container">
      <div className="landing-content" ref={landingContentRef}>
        <img src={`${process.env.PUBLIC_URL}/assets/icons/cosylanguages_logos/cosylanguages.png`} alt="Cosy Languages Logo" className="logo animated-logo" />

        {/* Section Langues disponibles */}
        <div className="languages-section">
          <LanguageSelector />
        </div>

        {/* Boutons principaux */}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">Freestyle</Link>
          <Link to="/study" className="landing-button">Study Mode</Link>
          <Link to="/community" className="landing-button">Community</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
