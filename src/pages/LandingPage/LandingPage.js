// Import necessary libraries and components.
import React, { useRef } from 'react';
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
  // Ref pour la zone d'accueil (pour positionner les confettis)
  const landingContentRef = useRef(null);

  // Fonction pour générer des confettis
  const launchConfetti = (e) => {
    const colors = ['#ff9800', '#ffc107', '#007bff', '#00c6ff', '#ff4081', '#4caf50'];
    const parent = landingContentRef.current;
    if (!parent) return;
    for (let i = 0; i < 18; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = (e.clientX - parent.getBoundingClientRect().left + (Math.random() * 60 - 30)) + 'px';
      confetti.style.top = (e.clientY - parent.getBoundingClientRect().top + (Math.random() * 20 - 10)) + 'px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      parent.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content" ref={landingContentRef}>
        <h1>Bienvenue sur Cosy Languages !</h1>
        <div className="encouragement-message">Chaque jour est une nouvelle aventure linguistique ! 🚀</div>
        <p>Apprenez, jouez et progressez chaque jour dans une ambiance fun et motivante.</p>
        {/* Logo animé */}
        <img src="/COSYlanguagesproject/cosylanguages.png" alt="Cosy Languages Logo" className="logo animated-logo" />
        {/* Bouton Quiz du jour avec effet confettis */}
        <div style={{ margin: '30px 0' }}>
          <Link to="/study-tools?quiz=day" className="quiz-button" onClick={launchConfetti}>Quiz du jour 🎲</Link>
        </div>
        {/* Boutons principaux */}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">Freestyle</Link>
          <Link to="/study" className="landing-button">Study Mode</Link>
          <Link to="/community" className="landing-button">Community</Link>
        </div>

        {/* Section Langues disponibles */}
        <div className="languages-section">
          <h2 style={{marginTop: '40px', fontSize: '1.5em', color: '#007bff'}}>Langues disponibles</h2>
          <div className="languages-logos">
            {/* English */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyenglish.png" alt="English Logo" className="language-logo" />
              <span>English</span>
            </div>
            {/* Italiano */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyitalian.png" alt="Italian Logo" className="language-logo" />
              <span>Italiano</span>
            </div>
            {/* Русский */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyrussian.png" alt="Russian Logo" className="language-logo" />
              <span>Русский</span>
            </div>
            {/* Français */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyfrench.png" alt="French Logo" className="language-logo" />
              <span>Français</span>
            </div>
            {/* Español */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyspanish.png" alt="Spanish Logo" className="language-logo" />
              <span>Español</span>
            </div>
            {/* Deutsch */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygerman.png" alt="German Logo" className="language-logo" />
              <span>Deutsch</span>
            </div>
            {/* Português */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyportuguese.png" alt="Portuguese Logo" className="language-logo" />
              <span>Português</span>
            </div>
            {/* Հայերեն (Arménien) */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyarmenian.png" alt="Armenian Logo" className="language-logo" />
              <span>Հայերեն</span>
            </div>
            {/* Ελληνικά (Grec) */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygreek.png" alt="Greek Logo" className="language-logo" />
              <span>Ελληνικά</span>
            </div>
            {/* ქართული (Géorgien) */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygeorgian.png" alt="Georgian Logo" className="language-logo" />
              <span>ქართული</span>
            </div>
            {/* Breton */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosybreton.png" alt="Breton Logo" className="language-logo" />
              <img src="/COSYlanguagesproject/assets/flags/Flag_of_Brittany.png" alt="Breton Flag" className="language-flag" />
              <span>Breton</span>
            </div>
            {/* Bashkir */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosybachkir.png" alt="Bashkir Logo" className="language-logo" />
              <img src="/COSYlanguagesproject/assets/flags/Flag_of_Bashkortostan.png" alt="Bashkir Flag" className="language-flag" />
              <span>Башҡортса</span>
            </div>
            {/* Tatar */}
            <div className="language-item">
              <img src="/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosytatar.png" alt="Tatar Logo" className="language-logo" />
              <img src="/COSYlanguagesproject/assets/flags/Flag_of_Tatarstan.png" alt="Tatar Flag" className="language-flag" />
              <span>Татарча</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
