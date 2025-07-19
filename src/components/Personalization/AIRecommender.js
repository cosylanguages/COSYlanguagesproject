import React, { useState, useEffect } from 'react';
import './AIRecommender.css';

const AIRecommender = ({ userPerformance }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // In a real app, this would be a call to an AI service
    const getRecommendations = () => {
      const newRecommendations = [];
      if (userPerformance.grammar < 70) {
        newRecommendations.push('Focus on grammar exercises.');
      }
      if (userPerformance.vocabulary < 70) {
        newRecommendations.push('Practice more vocabulary flashcards.');
      }
      setRecommendations(newRecommendations);
    };

    getRecommendations();
  }, [userPerformance]);

  return (
    <div className="ai-recommender">
      <h3>AI Recommendations</h3>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommender;
