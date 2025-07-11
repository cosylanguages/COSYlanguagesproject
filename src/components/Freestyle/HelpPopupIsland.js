import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
// Styles are handled by the global import of freestyle-shared.css in freestyleIslandsEntry.js

const HelpPopupIsland = () => {
  const { t } = useI18n();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <button
        id="floating-help-btn"
        onClick={() => setShowHelp(h => !h)}
        title={t('freestyle.helpButtonTitle', 'Help')}
        // Adding some basic styling directly if not covered by existing button styles
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1050 // Ensure it's above other elements but below modal if any
        }}
      >
        ?
      </button>
      {showHelp && (
        <div
          className="floating-popup"
          style={{
            position: 'fixed',
            bottom: '70px', // Adjust to be above the button
            right: '20px',
            width: '300px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 2000, // From original
            padding: '15px',
            borderRadius: '8px'
          }}
        >
          <div className="popup-header" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px'}}>
            {t('freestyle.quickHelpHeader', 'Quick Help')}
          </div>
          <div className="popup-content" style={{marginBottom: '15px'}}>
            {t('freestyle.quickHelpContent', 'Select a language, then a day and an exercise to begin. Use the help button to show or hide this window.')}
          </div>
          <div className="popup-actions" style={{textAlign: 'right'}}>
            <button
              className="btn btn-secondary" // Assuming .btn and .btn-secondary are globally available
              onClick={() => setShowHelp(false)}
              style={{padding: '8px 15px'}}
            >
              {t('buttons.close', 'Close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPopupIsland;
