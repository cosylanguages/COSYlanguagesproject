import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PinEntry = ({ onPinVerified }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const correctPin = '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === correctPin) {
      onPinVerified();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="pin-entry-container">
      <h2>Enter PIN for Study Mode</h2>
      <p>Please enter the 4-digit PIN to access this feature.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          className="pin-input"
        />
        <button type="submit" className="pin-submit-button">
          Unlock
        </button>
      </form>
      {error && <p className="pin-error">{error}</p>}
    </div>
  );
};

PinEntry.propTypes = {
  onPinVerified: PropTypes.func.isRequired,
};

export default PinEntry;
