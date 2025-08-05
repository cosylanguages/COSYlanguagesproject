import React from 'react';

const MindMatters = ({ content }) => {
  if (!content) return null;
  return (
    <div className="specialized-club-section">
      <h4>Mind Matters</h4>
      {content.infographicUrl && <img src={content.infographicUrl} alt={content.infographicDescription || "Psychological concept"} />}
      {content.conditionalQuestion && (
        <div>
          <h5>What if...</h5>
          <p>{content.conditionalQuestion}</p>
        </div>
      )}
      {content.personalityTest && (
        <div>
          <h5>Personality Snippet</h5>
          <p>{content.personalityTest.question}</p>
        </div>
      )}
    </div>
  );
};

export default MindMatters;
