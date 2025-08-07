import React, { useState } from 'react';
import TransliterableText from '../Common/TransliterableText';
import HelpModal from '../Common/HelpModal';
import './Achievements.css';

const Achievements = ({ achievements, mode }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2><TransliterableText text="Achievements" /></h2>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}>
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-details">
              <h3><TransliterableText text={achievement.name} /></h3>
              <p><TransliterableText text={achievement.description} /></p>
            </div>
          </div>
        ))}
      </div>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="achievements.help.title"
        content="achievements.help.content"
      />
    </div>
  );
};

export default Achievements;
