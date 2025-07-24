// Import necessary libraries and components.
import React from 'react';
import './MyLearningGarden.css';

/**
 * A component that displays the user's learning garden.
 * The garden contains plants that grow as the user makes progress.
 * @returns {JSX.Element} The MyLearningGarden component.
 */
const MyLearningGarden = () => {
  // TODO: Dynamically render plants based on user's progress.
  const plants = [
    { id: 1, name: 'Rose', level: 5 },
    { id: 2, name: 'Sunflower', level: 3 },
    { id: 3, name: 'Tulip', level: 8 },
  ];

  // Render the learning garden component.
  return (
    <div className="learning-garden-container">
      <h3>My Learning Garden</h3>
      <div className="garden">
        {plants.map((plant) => (
          <div key={plant.id} className="plant">
            <div className="plant-icon">🌱</div>
            <div className="plant-name">{plant.name}</div>
            <div className="plant-level">Level {plant.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLearningGarden;
