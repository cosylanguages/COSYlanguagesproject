import React, { useState } from 'react';

const QuizTaker = ({ quiz, onSubmit }) => {
    const [answers, setAnswers] = useState([]);

    const handleAnswerChange = (questionIndex, answer) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    return (
        <div className="quiz-taker">
            <h2>{quiz.title}</h2>
            {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question">
                    <p>{question.text}</p>
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex}>
                            <input
                                type="radio"
                                name={`question-${qIndex}`}
                                value={oIndex}
                                onChange={() => handleAnswerChange(qIndex, oIndex)}
                            />
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default QuizTaker;
