import React, { useState } from 'react';
import './TrueOrFalseGame.css';

function TrueOrFalseGame({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="true-or-false-game">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-text">{questions[currentQuestionIndex].questionText}</div>
          </div>
          <div className="answer-section">
            <button onClick={() => handleAnswerButtonClick(questions[currentQuestionIndex].isCorrect)}>True</button>
            <button onClick={() => handleAnswerButtonClick(!questions[currentQuestionIndex].isCorrect)}>False</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TrueOrFalseGame;
