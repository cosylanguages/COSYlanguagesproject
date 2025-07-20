import React from 'react';
import './LanguagePet.css';

const LanguagePet = () => {
  // TODO: Add functionality to choose a pet and have it grow.
  const pet = {
    name: 'Linguan',
    level: 1,
    imageUrl: '/assets/icons/cosylanguages_logos/cosyrussian.png', // Using a placeholder image
  };

  return (
    <div className="language-pet-container">
      <h3>My Language Pet</h3>
      <div className="pet">
        <img src={pet.imageUrl} alt="A cute language pet" className="pet-image" />
        <div className="pet-name">{pet.name}</div>
        <div className="pet-level">Level {pet.level}</div>
      </div>
    </div>
  );
};

export default LanguagePet;
