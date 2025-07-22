import React, { useState, useEffect } from 'react';
import './DictionaryPage.css';

function DictionaryPage() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch('/data/dictionary.json')
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  return (
    <div className="dictionary-page">
      <h1>Dictionary</h1>
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Translation</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.id}>
              <td>{word.word}</td>
              <td>{word.translation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DictionaryPage;
