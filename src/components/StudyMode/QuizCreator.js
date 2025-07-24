import React, { useState } from 'react';

const QuizCreator = () => {
    const [quiz, setQuiz] = useState({ title: '', questions: [] });

    const handleAddQuestion = () => {
        const newQuestion = {
            text: '',
            options: ['', '', '', ''],
            correctOption: 0,
            type: 'multiple-choice',
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[index][field] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    return (
        <div className="quiz-creator">
            <h2>Quiz Creator</h2>
            <input
                type="text"
                placeholder="Quiz Title"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
            {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-creator">
                    <input
                        type="text"
                        placeholder="Question Text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    />
                    {question.options.map((option, oIndex) => (
                        <input
                            key={oIndex}
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        />
                    ))}
                    <select
                        value={question.correctOption}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctOption', parseInt(e.target.value))}
                    >
                        {question.options.map((_, oIndex) => (
                            <option key={oIndex} value={oIndex}>
                                {`Option ${oIndex + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={handleAddQuestion}>Add Question</button>
            <button>Save Quiz</button>
        </div>
    );
};

export default QuizCreator;
