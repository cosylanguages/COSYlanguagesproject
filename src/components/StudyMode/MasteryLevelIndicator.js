import React from 'react';
import './MasteryLevelIndicator.css';

const MasteryLevelIndicator = ({ level }) => {
  const getLevelClass = () => {
    switch (level) {
      case 'Novice':
        return 'novice';
      case 'Intermediate':
        return 'intermediate';
      case 'Mastered':
        return 'mastered';
      default:
        return '';
    }
  };

  return (
    <div className={`mastery-level-indicator ${getLevelClass()}`}>
      {level}
    </div>
  );
};

export default MasteryLevelIndicator;
