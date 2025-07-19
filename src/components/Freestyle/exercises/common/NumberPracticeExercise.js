import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';

const NumberPracticeExercise = ({ language }) => {
    const { t } = useI18n();
    const [number, setNumber] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [isCorrect, setIsCorrect] = useState(false);

    const generateNewNumber = useCallback(() => {
        setNumber(Math.floor(Math.random() * 1000));
        setUserAnswer('');
        setFeedback({ message: '', type: '' });
        setIsCorrect(false);
    }, []);

    useEffect(() => {
        generateNewNumber();
    }, [generateNewNumber]);

    const checkAnswer = () => {
        // This is a placeholder for the actual number-to-word conversion logic
        const correctAnswer = number.toString(); // Replace with actual logic
        if (userAnswer.trim().toLowerCase() === correctAnswer) {
            setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'success' });
            setIsCorrect(true);
        } else {
            setFeedback({ message: t('feedback.incorrect', 'Incorrect, try again.'), type: 'error' });
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>{t('titles.numberPractice', 'Number Practice')}</h3>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{number}</p>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t('placeholders.typeTheNumber', 'Type the number in words')}
                style={{ width: '300px', padding: '10px', fontSize: '1em' }}
            />
            <FeedbackDisplay message={feedback.message} type={feedback.type} />
            <ExerciseControls
                onCheckAnswer={checkAnswer}
                onNextExercise={generateNewNumber}
                isAnswerCorrect={isCorrect}
                config={{
                    showCheck: true,
                    showNext: true,
                }}
            />
        </div>
    );
};

export default NumberPracticeExercise;
