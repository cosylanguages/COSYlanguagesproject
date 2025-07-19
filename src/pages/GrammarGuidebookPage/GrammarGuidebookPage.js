import React, { useState } from 'react';
import GrammarGuidebook from '../../components/StudyTools/GrammarGuidebook';

const guidebooks = [
  {
    id: 1,
    title: 'Introduction to German Cases',
    sections: [
      {
        title: 'Nominative',
        content: 'The nominative case is used for the subject of a sentence.',
      },
      {
        title: 'Accusative',
        content: 'The accusative case is used for the direct object of a sentence.',
      },
      {
        title: 'Dative',
        content: 'The dative case is used for the indirect object of a sentence.',
      },
      {
        title: 'Genitive',
        content: 'The genitive case is used to show possession.',
      },
    ],
  },
  {
    id: 2,
    title: 'French Verb Conjugation',
    sections: [
      {
        title: 'Présent',
        content: 'The present tense is used to describe actions happening now.',
      },
      {
        title: 'Passé Composé',
        content: 'The passé composé is used to describe actions that have already happened.',
      },
      {
        title: 'Imparfait',
        content: 'The imparfait is used to describe ongoing actions in the past.',
      },
      {
        title: 'Futur Simple',
        content: 'The futur simple is used to describe actions that will happen in the future.',
      },
    ],
  },
];

const GrammarGuidebookPage = () => {
  const [selectedGuidebook, setSelectedGuidebook] = useState(null);

  return (
    <div className="grammar-guidebook-page">
      <h1>Grammar Guidebooks</h1>
      <div className="guidebook-list">
        {guidebooks.map((guidebook) => (
          <button key={guidebook.id} onClick={() => setSelectedGuidebook(guidebook)}>
            {guidebook.title}
          </button>
        ))}
      </div>
      <hr />
      <GrammarGuidebook guidebook={selectedGuidebook} />
    </div>
  );
};

export default GrammarGuidebookPage;
