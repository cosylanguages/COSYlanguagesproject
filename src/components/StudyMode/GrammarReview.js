import React, { useState, useEffect } from 'react';
import './GrammarReview.css';

const GrammarReview = () => {
    const [exercises, setExercises] = useState({ sentenceCorrection: [], fillInTheBlanks: [] });
    const [currentExercise, setCurrentExercise] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        fetch('/data/grammar_exercises.json')
            .then(response => response.json())
            .then(data => {
                setExercises(data);
                setCurrentExercise(data.sentenceCorrection[0]);
            });
    }, []);

    const handleInputChange = (e) => {
        setUserAnswer(e.target.value);
    };

    const checkAnswer = () => {
        setShowExplanation(true);
    };

    const nextExercise = () => {
        setShowExplanation(false);
        setUserAnswer('');
        // This is a simple way to cycle through exercises. A more robust solution would be to randomly select an exercise.
        const allExercises = [...exercises.sentenceCorrection, ...exercises.fillInTheBlanks];
        const currentIndex = allExercises.findIndex(ex => ex.id === currentExercise.id && ex.sentence === currentExercise.sentence);
        const nextIndex = (currentIndex + 1) % allExercises.length;
        setCurrentExercise(allExercises[nextIndex]);
    };

    const renderExercise = () => {
        if (!currentExercise) {
            return <p>Loading exercises...</p>;
        }

        if (currentExercise.hasOwnProperty('correction')) {
            return (
                <div className="sentence-correction">
                    <h3>Sentence Correction</h3>
                    <p>Correct the following sentence:</p>
                    <p><em>{currentExercise.sentence}</em></p>
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={handleInputChange}
                        placeholder="Enter your correction"
                    />
                </div>
            );
        }

        if (currentExercise.hasOwnProperty('options')) {
            return (
                <div className="fill-in-the-blanks">
                    <h3>Fill in the Blanks</h3>
                    <p>{currentExercise.sentence.replace('___', '_____')}</p>
                    <div className="options">
                        {currentExercise.options.map(option => (
                            <button key={option} onClick={() => setUserAnswer(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return <p>Unknown exercise type.</p>;
    };

    const renderExplanation = () => {
        if (!showExplanation || !currentExercise) {
            return null;
        }

        const isCorrect = userAnswer.toLowerCase() === (currentExercise.correction || currentExercise.answer).toLowerCase();

        return (
            <div className="explanation">
                <p className={isCorrect ? 'correct' : 'incorrect'}>
                    {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p><strong>Explanation:</strong> {currentExercise.explanation}</p>
                <button onClick={nextExercise}>Next Exercise</button>
            </div>
        );
    };

    return (
        <div className="grammar-review">
            <h2>Grammar Review</h2>
            {renderExercise()}
            <button onClick={checkAnswer} disabled={!userAnswer}>Check</button>
            {renderExplanation()}
        </div>
    );
};

export default GrammarReview;
