import React from 'react';
import './MyLearningGarden.css';

const MyLearningGarden = () => {
  // TODO: Dynamically render plants based on user's progress.
  const plants = [
    { id: 1, name: 'Rose', level: 5 },
    { id: 2, name: 'Sunflower', level: 3 },
    { id: 3, name: 'Tulip', level: 8 },
  ];

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
