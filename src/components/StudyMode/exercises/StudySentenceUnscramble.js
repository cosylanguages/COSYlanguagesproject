import React, { useState, useEffect } from 'react';
import SentenceUnscrambleExercise from '../../Freestyle/exercises/common/SentenceUnscrambleExercise';
import { loadSentenceUnscrambleData } from '../../../utils/exerciseDataService';

const StudySentenceUnscramble = ({ language }) => {
    const [exerciseData, setExerciseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const { data, error: fetchError } = await loadSentenceUnscrambleData(language);
                if (fetchError) {
                    throw new Error(fetchError.message || 'Failed to load exercises.');
                }
                if (!data || data.length === 0) {
                    setError('No sentence unscramble exercises found for this language.');
                } else {
                    // For now, just pick the first exercise.
                    setExerciseData(data[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (language) {
            fetchExercise();
        }
    }, [language]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!exerciseData) {
        return <div>No exercise available.</div>;
    }

    return (
        <div className="study-sentence-unscramble">
            <h3>Sentence Unscramble (Study Mode)</h3>
            <SentenceUnscrambleExercise exerciseData={exerciseData} />
        </div>
    );
};

export default StudySentenceUnscramble;
