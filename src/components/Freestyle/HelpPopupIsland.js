import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import './HelpPopupIsland.css';

const HelpPopupIsland = () => {
  const { t } = useI18n();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <Button
        id="floating-help-btn"
        onClick={() => setShowHelp(h => !h)}
        title={t('freestyle.helpButtonTitle', 'Help')}
        className="floating-help-btn"
      >
        ?
      </Button>
      {showHelp && (
        <div
          className="floating-popup"
        >
          <div className="popup-header">
            {t('freestyle.quickHelpHeader', 'Quick Help')}
          </div>
          <div className="popup-content">
            {t('freestyle.quickHelpContent', 'Select a language, then a day and an exercise to begin. Use the help button to show or hide this window.')}
          </div>
          <div className="popup-actions">
            <Button
              className="button--secondary"
              onClick={() => setShowHelp(false)}
            >
              {t('buttons.close', 'Close')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPopupIsland;
