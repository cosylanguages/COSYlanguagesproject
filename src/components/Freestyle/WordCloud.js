import React from 'react';
import './WordCloud.css';

const WordCloud = ({ words }) => {
  return (
    <div className="word-cloud">
      <h3>Words Discovered</h3>
      <p>This is a visual representation of the words you will encounter in this booster pack.</p>
      <div className="cloud">
        {words.map((word, index) => (
          <span key={index} style={{ fontSize: `${word.size}em` }}>
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;
