import React from 'react';
import Flashcard from '../../components/StudyTools/Flashcard';
import './StudyToolsPage.css';

const StudyToolsPage = () => {
  const card = {
    front: 'Bonjour',
    back: 'Hello',
  };

  return (
    <div className="study-tools-page">
      <h1>Study Tools</h1>
      <Flashcard card={card} />
    </div>
  );
};

export default StudyToolsPage;
