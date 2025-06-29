import React, { useState } from 'react';
import './Modal.css'; // Assuming a generic Modal.css exists or will be created

const PinModal = ({ onSubmit, onClose, error }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pin);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content pin-modal-content">
        <h2>Enter PIN for Study Mode</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            maxLength="8" // Or whatever max length is appropriate
            style={{ 
              padding: '10px', 
              fontSize: '1rem', 
              width: 'calc(100% - 22px)', // Account for padding
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}
          <div className="modal-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
            {onClose && ( // Optional close button
                <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel 
                </button>
            )}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
