import React, { useState, useEffect } from 'react';
import { getMistakes } from '../../utils/mistakeLogger';
import './MistakeNotebook.css';

const MistakeNotebook = () => {
    const [mistakes, setMistakes] = useState([]);

    useEffect(() => {
        setMistakes(getMistakes());
    }, []);

    return (
        <div className="mistake-notebook">
            <h2>Mistake Notebook</h2>
            {mistakes.length > 0 ? (
                <ul>
                    {mistakes.map((mistake, index) => (
                        <li key={index}>
                            <p><strong>Exercise:</strong> {mistake.exercise}</p>
                            <p><strong>Your Answer:</strong> {mistake.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> {mistake.correctAnswer}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No mistakes recorded yet. Keep practicing!</p>
            )}
        </div>
    );
};

export default MistakeNotebook;
