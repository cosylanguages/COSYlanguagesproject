import React, { useState } from 'react';

const QuizTaker = ({ quiz, onSubmit }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleAnswerSelect = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);

        // Fade out, then move to next question
        // For simplicity, we'll just move to the next question directly
        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300); // This timeout can be used for a fade-out animation
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="quiz-card">
            <div className="progress-bar">
                <div className="progress-bar__inner" style={{ width: `${progress}%` }}></div>
            </div>
            <div id="question-container">
                <h2>{quiz.title}</h2>
                <div className="question">
                    <p>{currentQuestion.text}</p>
                    {currentQuestion.options.map((option, oIndex) => (
                        <div key={oIndex}>
                            <button onClick={() => handleAnswerSelect(oIndex)}>{option}</button>
                        </div>
                    ))}
                </div>
            </div>
            {currentQuestionIndex === quiz.questions.length - 1 && (
                <button onClick={handleSubmit}>Submit</button>
            )}
        </div>
    );
};

export default QuizTaker;
