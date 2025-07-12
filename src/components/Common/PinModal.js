import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Import useI18n for title
import Button from './Button'; // Import the new Button component
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
        <p>Please enter the PIN to access the study mode. If you do not have a PIN, please contact the administrator.</p>
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
                <Button type="button" onClick={onClose} variant="secondary">
                    {t('buttons.cancel', 'Cancel')}
                </Button>
            )}
            <Button type="submit" variant="primary">
              {t('buttons.submit', 'Submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
