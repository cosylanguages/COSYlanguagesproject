// src/components/Dashboard/MyLearningGarden.js
import React from 'react';
import './MyLearningGarden.css';

const MyLearningGarden = () => {
  return (
    <div className="learning-garden">
      <h2>My Learning Garden</h2>
      <div className="garden">
        <div className="plant plant-1"></div>
        <div className="plant plant-2"></div>
        <div className="plant plant-3"></div>
      </div>
      <p>Your garden is just starting to grow. Keep learning to see it flourish!</p>
    </div>
  );
};

export default MyLearningGarden;
