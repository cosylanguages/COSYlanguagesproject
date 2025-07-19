import React from 'react';
import './SessionSummary.css';

const SessionSummary = ({ summary }) => {
  return (
    <div className="session-summary">
      <h3>Session Summary</h3>
      <p>Time spent: {summary.timeSpent}</p>
      <p>Words learned: {summary.wordsLearned}</p>
      <p>XP gained: {summary.xpGained}</p>
    </div>
  );
};

export default SessionSummary;
