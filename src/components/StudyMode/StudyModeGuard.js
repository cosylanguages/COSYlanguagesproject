import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import PinEntry from './PinEntry';

const StudyModeGuard = ({ children }) => {
  const { currentUser } = useAuth();
  const [isPinVerified, setIsPinVerified] = useState(false);

  const handlePinVerified = () => {
    setIsPinVerified(true);
  };

  // User has access if they are a paid user or if they have verified the PIN.
  const hasAccess = currentUser?.isPaidUser || isPinVerified;

  if (hasAccess) {
    return children;
  }

  return <PinEntry onPinVerified={handlePinVerified} />;
};

StudyModeGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StudyModeGuard;
