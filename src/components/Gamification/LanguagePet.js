// Import necessary libraries and components.
import React from 'react';
import './LanguagePet.css';

/**
 * A component that displays the user's language pet.
 * @returns {JSX.Element} The LanguagePet component.
 */
const LanguagePet = () => {
  // TODO: Add functionality to choose a pet and have it grow.
  const pet = {
    name: 'Linguan',
    level: 1,
    imageUrl: '/assets/icons/cosylanguages_logos/cosyrussian.png', // Using a placeholder image
  };

  // Render the language pet component.
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
