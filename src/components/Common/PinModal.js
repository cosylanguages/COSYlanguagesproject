import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Import useI18n for title
import './Modal.css'; 

const PinModal = ({ onSubmit, onClose, error }) => {
  const [pin, setPin] = useState('');
  const { t } = useI18n(); // For translating title and placeholders if needed

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pin);
  };

  return (
    <div className="modal-overlay"> {/* Changed from modal-backdrop */}
      <div className="modal-content pin-modal-content">
        <h2>{t('pinPromptMessage', 'Enter PIN for Study Mode')}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('enterPinPlaceholder', 'Enter PIN')} // Added placeholder translation
            maxLength="8" 
            className="pin-modal-input" // Added class for styling
          />
          {error && <p className="pin-modal-error">{error}</p>} {/* Added class for styling */}
          <div className="modal-actions pin-modal-actions"> {/* Added class & kept modal-actions for base styling */}
            {onClose && (
                <button type="button" onClick={onClose} className="btn btn-secondary">
                    {t('buttons.cancel', 'Cancel')}
                </button>
            )}
            <button type="submit" className="btn btn-primary">
              {t('buttons.submit', 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
