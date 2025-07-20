import React from 'react';
import './SouvenirCollection.css';

const SouvenirCollection = () => {
  // TODO: Unlock souvenirs by completing lessons or challenges.
  const souvenirs = [
    { id: 1, name: 'Eiffel Tower', country: 'France' },
    { id: 2, name: 'Colosseum', country: 'Italy' },
    { id: 3, name: 'Kremlin', country: 'Russia' },
  ];

  return (
    <div className="souvenir-collection-container">
      <h3>My Souvenir Collection</h3>
      <div className="souvenirs">
        {souvenirs.map((souvenir) => (
          <div key={souvenir.id} className="souvenir">
            <div className="souvenir-icon">🏆</div>
            <div className="souvenir-name">{souvenir.name}</div>
            <div className="souvenir-country">{souvenir.country}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SouvenirCollection;
