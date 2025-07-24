import React from 'react';

const QuizResults = ({ quiz, answers }) => {
    const calculateScore = () => {
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctOption === answers[index]) {
                score++;
            }
        });
        return score;
    };

    return (
        <div className="quiz-results">
            <h2>Quiz Results</h2>
            <p>
                You scored {calculateScore()} out of {quiz.questions.length}
            </p>
        </div>
    );
};

export default QuizResults;
