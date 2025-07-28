// Import necessary libraries and components.
import React, { useState, useRef } from 'react';
// Import the Link component from react-router-dom for navigation.
import { Link } from 'react-router-dom';
// Import the CSS for this component.
import './LandingPage.css';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import Calculator from '../../components/Calculator/Calculator';

/**
 * The main landing page for the application.
 * It serves as the entry point for users, displaying the application's logo
 * and providing navigation to the main sections of the app: Freestyle, Study Mode, and Community.
 * @returns {JSX.Element} The LandingPage component.
 */
function LandingPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  // Ref pour la zone d'accueil (pour positionner les confettis)
  const landingContentRef = useRef(null);

  return (
    <div className="landing-container">
      <div className="landing-content" ref={landingContentRef}>
        <h1>Bienvenue sur Cosy Languages !</h1>
        <div className="encouragement-message">Chaque jour est une nouvelle aventure linguistique ! 🚀</div>
        <p>Apprenez, jouez et progressez chaque jour dans une ambiance fun et motivante.</p>
        {/* Logo animé */}
        <img src="/COSYlanguagesproject/cosylanguages.png" alt="Cosy Languages Logo" className="logo animated-logo" />
        {/* Boutons principaux */}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">Freestyle</Link>
          <Link to="/study" className="landing-button">Study Mode</Link>
          <Link to="/community" className="landing-button">Community</Link>
        </div>

        {/* Section Langues disponibles */}
        <div className="languages-section">
          <h2 style={{marginTop: '40px', fontSize: '1.5em', color: '#007bff'}}>Langues disponibles</h2>
          <LanguageSelector />
        </div>
        <div className={`calculator-wrapper ${isCalculatorOpen ? 'open' : ''}`}>
          <button onClick={() => setIsCalculatorOpen(!isCalculatorOpen)} className="calculator-toggle">
            🧮
          </button>
          <div className="calculator-container">
            <Calculator />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
