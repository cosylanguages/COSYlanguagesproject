import React from 'react';

const TheGreatestQuotes = ({ content }) => {
  if (!content) return null;
  return (
    <div className="specialized-club-section">
      <h4>The Greatest Quotes</h4>
      {content.quote && (
        <div className="animated-quote">
          <blockquote>"{content.quote.text}"</blockquote>
          <cite>- {content.quote.author}</cite>
          <p><strong>Context:</strong> {content.quote.context}</p>
        </div>
      )}
    </div>
  );
};

export default TheGreatestQuotes;
