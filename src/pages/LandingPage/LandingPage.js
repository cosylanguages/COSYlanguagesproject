// Import necessary libraries and components.
import React, { useState, useRef } from 'react';
// Import the Link component from react-router-dom for navigation.
import { Link } from 'react-router-dom';
// Import the CSS for this component.
import './LandingPage.css';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import Calculator from '../../components/Calculator/Calculator';
import { useI18n } from '../../i18n/I18nContext';

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
  const { t } = useI18n();


  return (
    <div className="landing-container">
      <div className="landing-content" ref={landingContentRef}>
        <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosylanguages.png" alt="Cosy Languages Logo" className="logo animated-logo" />

        {/* Section Langues disponibles */}
        <div className="languages-section">
          <LanguageSelector />
        </div>

        {/* Boutons principaux */}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">{t('Freestyle')}</Link>
          <Link to="/study" className="landing-button">{t('Study Mode')}</Link>
          <Link to="/community" className="landing-button">{t('Community')}</Link>
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
