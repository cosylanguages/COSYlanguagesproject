import React, { useState } from 'react';
import Toast from '../Common/Toast';

const QuizTaker = ({ quiz, onSubmit }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });

    const handleAnswerSelect = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);

        const isCorrect = answer === quiz.questions[currentQuestionIndex].correctAnswer;
        setToast({ message: isCorrect ? '✅ Correct!' : '❌ Try again!', type: isCorrect ? 'success' : 'error' });

        if (isCorrect) {
            setTimeout(() => {
                setToast({ message: '', type: '' });
                if (currentQuestionIndex < quiz.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            }, 1000);
        }
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="quiz-card">
            <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: '' })} />
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
