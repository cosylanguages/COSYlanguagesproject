import React, { useState } from 'react';

const PinEntry = ({ onPinVerified }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinChange = (e) => {
        setPin(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === '1234') {
            onPinVerified();
        } else {
            setError('Invalid PIN. Please try again.');
        }
    };

    return (
        <div className="pin-entry">
            <h2>Enter PIN for Study Mode</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={pin}
                    onChange={handlePinChange}
                    maxLength="4"
                />
                <button type="submit">Enter</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default PinEntry;
