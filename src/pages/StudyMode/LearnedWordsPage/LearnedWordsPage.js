import React, { useState, useEffect } from 'react';
import './LearnedWordsPage.css';

function LearnedWordsPage() {
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    fetch('/data/learnedWords.json')
      .then((res) => res.json())
      .then((data) => setLearnedWords(data));
  }, []);

  return (
    <div className="learned-words-page">
      <h1>Words You've Learned</h1>
      <div className="learned-words-list">
        {learnedWords.map((word) => (
          <div key={word.id} className="learned-word-item">
            <h2>{word.word}</h2>
            <p>{word.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearnedWordsPage;
