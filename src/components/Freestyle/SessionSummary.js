import React from 'react';
import './SessionSummary.css';

const SessionSummary = ({ summary }) => {
  return (
    <div className="session-summary">
      <h3>Booster Pack Description</h3>
      <p>{summary.description}</p>
    </div>
  );
};

export default SessionSummary;
