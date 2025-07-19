import React from 'react';
import AIConversation from '../../components/Interactive/AIConversation';
import './InteractivePage.css';

const InteractivePage = () => {
  return (
    <div className="interactive-page">
      <h1>Interactive Exercises</h1>
      <AIConversation />
    </div>
  );
};

export default InteractivePage;
