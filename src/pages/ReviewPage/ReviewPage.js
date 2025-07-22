import React, { useState, useEffect } from 'react';
import './ReviewPage.css';
import MatchingPairsGame from '../../components/Review/MatchingPairsGame';
import TrueOrFalseGame from '../../components/Review/TrueOrFalseGame';

function ReviewPage() {
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

  const [questions, setQuestions] = useState([]);

  React.useEffect(() => {
    fetch('/data/reviewQuestions.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const [matchingPairs, setMatchingPairs] = useState([]);

  useEffect(() => {
    fetch('/data/matchingPairs.json')
      .then((res) => res.json())
      .then((data) => setMatchingPairs(data));
  }, []);

  const [trueOrFalseQuestions, setTrueOrFalseQuestions] = useState([]);

  useEffect(() => {
    fetch('/data/trueOrFalseQuestions.json')
      .then((res) => res.json())
      .then((data) => setTrueOrFalseQuestions(data));
  }, []);

  return (
    <div className="review-page">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        questions.length > 0 && (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{questions[currentQuestionIndex].questionText}</div>
            </div>
            <div className="answer-section">
              {questions[currentQuestionIndex].answerOptions.map((answerOption, index) => (
                <button key={index} onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </>
        )
      )}
      {matchingPairs.length > 0 && <MatchingPairsGame pairs={matchingPairs} />}
      {trueOrFalseQuestions.length > 0 && <TrueOrFalseGame questions={trueOrFalseQuestions} />}
    </div>
  );
}

export default ReviewPage;
