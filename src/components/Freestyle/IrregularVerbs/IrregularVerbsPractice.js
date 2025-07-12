import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import IrregularVerbLevelSelector from './IrregularVerbLevelSelector';
import useIrregularVerbs from '../../../hooks/useIrregularVerbs.js';
import IrregularVerbQuiz from '../exercises/grammar/IrregularVerbQuiz';
import FillLettersExercise from './FillLettersExercise';
import FillBlanksExercise from './FillBlanksExercise';
import ExerciseControls from '../ExerciseControls';
import './IrregularVerbsPractice.css';

const IrregularVerbsPractice = () => {
    const [searchParams] = useSearchParams();
    const levels = searchParams.get('levels');
    const variety = searchParams.get('variety');
    const { verbs, loading, error } = useIrregularVerbs(levels, variety);
    const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [exerciseType, setExerciseType] = useState('quiz'); // 'quiz', 'fill-letters', 'fill-blanks'

    useEffect(() => {
        if (verbs.length > 0) {
            setCurrentVerbIndex(0);
        }
    }, [verbs]);

    if (!levels) {
        return <IrregularVerbLevelSelector />;
    }

    if (loading) {
        return <div>Loading verbs...</div>;
    }

    if (error) {
        return <div>Error loading verbs: {error.message}</div>;
    }

    const currentVerb = verbs[currentVerbIndex];

    const handleNext = () => {
        setShowDefinition(false);
        setCurrentVerbIndex(prevIndex => (prevIndex + 1) % verbs.length);
    };

    const renderExercise = () => {
        if (!currentVerb) return null;

        switch (exerciseType) {
            case 'quiz':
                return (
                    <IrregularVerbQuiz
                        verb={currentVerb}
                        language="COSYenglish"
                        onCheckAnswer={() => {}}
                        onSetFeedback={() => {}}
                        isRevealedExternally={false}
                        onSetCorrect={() => {}}
                    />
                );
            case 'fill-letters':
                return <FillLettersExercise verb={currentVerb} onCorrect={() => {}} onIncorrect={() => {}} />;
            case 'fill-blanks':
                return <FillBlanksExercise verb={currentVerb} onCorrect={() => {}} onIncorrect={() => {}} />;
            default:
                return null;
        }
    };

    return (
        <div className="irregular-verbs-practice-container">
            <h1>Irregular Verbs Practice</h1>
            <div className="exercise-type-selector">
                <button onClick={() => setExerciseType('quiz')} className={exerciseType === 'quiz' ? 'selected' : ''}>Quiz</button>
                <button onClick={() => setExerciseType('fill-letters')} className={exerciseType === 'fill-letters' ? 'selected' : ''}>Fill Letters</button>
                <button onClick={() => setExerciseType('fill-blanks')} className={exerciseType === 'fill-blanks' ? 'selected' : ''}>Fill Blanks</button>
            </div>
            <div
                className="verb-definition-container"
                onMouseEnter={() => setShowDefinition(true)}
                onMouseLeave={() => setShowDefinition(false)}
            >
                {renderExercise()}
                {showDefinition && currentVerb && (
                    <div className="verb-definition-popup">
                        <p><strong>Definition:</strong> {currentVerb.definition}</p>
                        <p><strong>Example:</strong> {currentVerb.example}</p>
                    </div>
                )}
            </div>
            <ExerciseControls
                onNextExercise={handleNext}
                onRevealAnswer={() => {}}
                onCheckAnswer={() => {}}
                config={{
                    showNext: true,
                    showReveal: true,
                    showCheck: true,
                    showHint: false,
                    showRandomize: true,
                }}
                isAnswerCorrect={false}
                isRevealed={false}
                onRandomize={() => setCurrentVerbIndex(Math.floor(Math.random() * verbs.length))}
            />
        </div>
    );
};

export default IrregularVerbsPractice;
