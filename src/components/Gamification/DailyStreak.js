import React, { useState } from 'react';
import TransliterableText from '../Common/TransliterableText';
import HelpModal from '../Common/HelpModal';
import './DailyStreak.css';

const DailyStreak = ({ data }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div className="daily-streak-container">
      <div className="daily-streak-header">
        <h2><TransliterableText text="Daily Streak" /></h2>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <div className="daily-streak-content">
        <div className="streak-icon">🔥</div>
        <div className="streak-count">{data.streak}</div>
        <div className="streak-label"><TransliterableText text="days" /></div>
      </div>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="dailyStreak.help.title"
        content="dailyStreak.help.content"
      />
    </div>
  );
};

export default DailyStreak;
