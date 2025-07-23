import React from 'react';
import './TodaysFocus.css';

const TodaysFocus = () => {
  // TODO: Integrate with AIRecommender.js to provide personalized recommendations.
  const todaysFocus = {
    title: "Today's Focus",
    recommendation: 'Practice your verb conjugations!',
  };

  return (
    <div className="todays-focus-container">
      <h3>{todaysFocus.title}</h3>
      <p>{todaysFocus.recommendation}</p>
    </div>
  );
};

export default TodaysFocus;
