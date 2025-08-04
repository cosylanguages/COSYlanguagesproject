import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import IrregularVerbLevelSelector from './IrregularVerbLevelSelector';
import useVerbs from '../../../hooks/useVerbs.js';
import IrregularVerbQuiz from '../exercises/grammar/IrregularVerbQuiz';
import FillLettersExercise from './FillLettersExercise';
import FillBlanksExercise from './FillBlanksExercise';
import ExerciseControls from '../ExerciseControls';
import './IrregularVerbsPractice.css';

const IrregularVerbsPractice = () => {
    const [searchParams] = useSearchParams();
    const levels = searchParams.get('levels');
    const lang = searchParams.get('lang');
    const { verbs, loading, error } = useVerbs(levels, lang);
    const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [exerciseType, setExerciseType] = useState('quiz'); // 'quiz', 'fill-letters', 'fill-blanks'
    const [category, setCategory] = useState('all');

    useEffect(() => {
        if (verbs.length > 0) {
            setCurrentVerbIndex(0);
        }
    }, [verbs]);

    if (!levels || !lang) {
        return <IrregularVerbLevelSelector />;
    }

    if (loading) {
        return <div>Loading verbs...</div>;
    }

    if (error) {
        return <div>Error loading verbs: {error.message}</div>;
    }

    const getCategories = () => {
        const categories = new Set(verbs.map(verb => verb.verb_group));
        return ['all', ...Array.from(categories)];
    };

    const filteredVerbs = category === 'all' ? verbs : verbs.filter(verb => verb.verb_group === category);
    const currentVerb = filteredVerbs[currentVerbIndex];

    const handleNext = () => {
        setShowDefinition(false);
        setCurrentVerbIndex(prevIndex => (prevIndex + 1) % filteredVerbs.length);
    };

    const renderExercise = () => {
        if (!currentVerb) return null;

        switch (exerciseType) {
            case 'quiz':
                return (
                    <IrregularVerbQuiz
                        verb={currentVerb}
                        language={lang}
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
                <Link to="/" className="study-mode-button">Study Mode</Link>
            </div>
            <div className="category-selector">
                {getCategories().map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={category === cat ? 'selected' : ''}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div
                className="verb-definition-container"
                onMouseEnter={() => setShowDefinition(true)}
                onMouseLeave={() => setShowDefinition(false)}
            >
                {renderExercise()}
                {showDefinition && currentVerb && (
                    <div className="verb-definition-popup">
                        <p><strong>Translation:</strong> {currentVerb.translation_en}</p>
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
                onRandomize={() => setCurrentVerbIndex(Math.floor(Math.random() * filteredVerbs.length))}
            />
        </div>
    );
};

export default IrregularVerbsPractice;
