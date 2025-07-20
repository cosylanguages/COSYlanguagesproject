import React, { useState } from 'react';

const MultipleChoiceQuestion = ({ question, options, correctAnswer, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        const correct = option === correctAnswer;
        setIsCorrect(correct);
        onAnswered(correct);
    };

    return (
        <div className="multiple-choice-question">
            <p>{question}</p>
            <div className="options">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={`
                            ${selectedOption === option ? (isCorrect ? 'correct' : 'incorrect') : ''}
                        `}
                        disabled={selectedOption !== null}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;
