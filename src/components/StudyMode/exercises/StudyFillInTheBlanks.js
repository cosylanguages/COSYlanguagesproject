import React, { useState, useEffect } from 'react';
import FillInTheBlanksExercise from '../../Freestyle/exercises/common/FillInTheBlanksExercise';
import { loadFillInTheBlanksData } from '../../../utils/exerciseDataService';

const StudyFillInTheBlanks = ({ language }) => {
    const [exerciseData, setExerciseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const { data, error: fetchError } = await loadFillInTheBlanksData(language);
                if (fetchError) {
                    throw new Error(fetchError.message || 'Failed to load exercises.');
                }
                if (!data || data.length === 0) {
                    setError('No fill in the blanks exercises found for this language.');
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
        <div className="study-fill-in-the-blanks">
            <h3>Fill in the Blanks (Study Mode)</h3>
            <FillInTheBlanksExercise exerciseData={exerciseData} />
        </div>
    );
};

export default StudyFillInTheBlanks;
