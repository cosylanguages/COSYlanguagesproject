import React, { useState, useEffect } from 'react';
import { getMistakes } from '../../utils/mistakeLogger';
import './MistakeNotebook.css';

const MistakeNotebook = () => {
    const [mistakes, setMistakes] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        setMistakes(getMistakes());
    }, []);

    const filteredMistakes = mistakes
        .filter(mistake => filterType === 'all' || mistake.type === filterType)
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.timestamp) - new Date(a.timestamp);
            } else {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
        });

    return (
        <div className="mistake-notebook">
            <h2>Mistake Notebook</h2>
            <div className="filters">
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="pronunciation">Pronunciation</option>
                    <option value="writing">Writing</option>
                    <option value="grammar">Grammar</option>
                </select>
                <select onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
            {filteredMistakes.length > 0 ? (
                <ul>
                    {filteredMistakes.map((mistake, index) => (
                        <li key={index}>
                            <p><strong>Type:</strong> {mistake.type}</p>
                            <p><strong>Question:</strong> {mistake.question}</p>
                            <p><strong>Your Answer:</strong> {mistake.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> {mistake.correctAnswer}</p>
                            <p><strong>Explanation:</strong> {mistake.explanation}</p>
                            <p><strong>Timestamp:</strong> {new Date(mistake.timestamp).toLocaleString()}</p>
                            <button onClick={() => alert('Practice this mistake!')}>Practice</button>
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
