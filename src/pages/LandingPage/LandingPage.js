// Import necessary libraries and components.
import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
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
  const { t } = useI18n();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <img src={`${process.env.PUBLIC_URL}/assets/icons/cosylanguages_logos/cosylanguages.png`} alt={t('landingPage.logoAlt', 'Cosy Languages Logo')} className="logo animated-logo" />

        {/* Available Languages Section */}
        <div className="languages-section">
          <LanguageSelector />
        </div>

        {/* Main Buttons */}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">{t('landingPage.freestyleButton', 'Freestyle')}</Link>
          <Link to="/study" className="landing-button">{t('landingPage.studyModeButton', 'Study Mode')}</Link>
          <Link to="/community" className="landing-button">{t('landingPage.communityButton', 'Community')}</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
