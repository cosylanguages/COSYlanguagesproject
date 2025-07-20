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
                            <p><strong>Type:</strong> {mistake.type}</p>
                            <p><strong>Question:</strong> {mistake.question}</p>
                            <p><strong>Your Answer:</strong> {mistake.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> {mistake.correctAnswer}</p>
                            <p><strong>Timestamp:</strong> {new Date(mistake.timestamp).toLocaleString()}</p>
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
