import React from 'react';
import './WordCloud.css';

const WordCloud = ({ words }) => {
  return (
    <div className="word-cloud">
      <h3>Words Discovered</h3>
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
