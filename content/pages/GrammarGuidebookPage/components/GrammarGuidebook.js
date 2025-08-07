import React from 'react';
import './GrammarGuidebook.css';

const GrammarGuidebook = ({ guidebook }) => {
  if (!guidebook) {
    return <div>Select a guidebook to get started.</div>;
  }

  return (
    <div className="grammar-guidebook">
      <h2>{guidebook.title}</h2>
      {guidebook.sections.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default GrammarGuidebook;
