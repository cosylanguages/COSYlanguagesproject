import React from 'react';

const KeepingUpWithScience = ({ content }) => {
  if (!content) return null;
  return (
    <div className="specialized-club-section">
      <h4>Keeping Up With Science</h4>
      {content.article && (
        <div className="embedded-article">
          <h5>{content.article.title}</h5>
          <p>{content.article.preview}</p>
          <strong>Key Stat: {content.article.keyStat}</strong>
        </div>
      )}
      {content.factOrMyth && (
        <div className="fact-or-myth">
          <h5>Fact or Myth?</h5>
          <p>{content.factOrMyth.statement}</p>
        </div>
      )}
    </div>
  );
};

export default KeepingUpWithScience;
