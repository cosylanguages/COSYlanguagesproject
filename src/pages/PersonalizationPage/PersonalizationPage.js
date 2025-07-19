import React from 'react';
import CustomLessonPlanner from '../../components/Personalization/CustomLessonPlanner';
import AIRecommender from '../../components/Personalization/AIRecommender';
import './PersonalizationPage.css';

const PersonalizationPage = () => {
  const handleSavePlan = (plan) => {
    console.log('Saved plan:', plan);
    // Here you would typically save the plan to the user's profile
  };

  const userPerformance = {
    grammar: 65,
    vocabulary: 80,
  };

  return (
    <div className="personalization-page">
      <h1>Personalize Your Learning</h1>
      <CustomLessonPlanner onSavePlan={handleSavePlan} />
      <AIRecommender userPerformance={userPerformance} />
    </div>
  );
};

export default PersonalizationPage;
