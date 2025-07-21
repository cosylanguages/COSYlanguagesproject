import React, { useState } from 'react';
import PinEntry from './PinEntry';

const StudyModeGuard = ({ children }) => {
    const [pinVerified, setPinVerified] = useState(false);

    const handlePinVerified = () => {
        setPinVerified(true);
    };

    if (!pinVerified) {
        return <PinEntry onPinVerified={handlePinVerified} />;
    }

    return children;
};

export default StudyModeGuard;
