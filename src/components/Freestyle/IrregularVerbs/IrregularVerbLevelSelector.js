import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IrregularVerbLevelSelector.css';

const IrregularVerbLevelSelector = () => {
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [languageVariety, setLanguageVariety] = useState('all');
    const navigate = useNavigate();

    const levels = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'all'];

    const handleLevelChange = (level) => {
        if (level === 'all') {
            setSelectedLevels(selectedLevels.length === levels.length - 1 ? [] : levels.filter(l => l !== 'all'));
        } else {
            setSelectedLevels(prev =>
                prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
            );
        }
    };

    const handleStart = () => {
        navigate(`/study/irregular-verbs/practice?levels=${selectedLevels.join(',')}&variety=${languageVariety}`);
    };

    return (
        <div className="level-selector-container">
            <h2>Select Irregular Verb Levels</h2>
            <div className="level-options">
                {levels.map(level => (
                    <button
                        key={level}
                        className={`level-button ${selectedLevels.includes(level) || (level === 'all' && selectedLevels.length === levels.length - 1) ? 'selected' : ''}`}
                        onClick={() => handleLevelChange(level)}
                    >
                        {level.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="language-variety-selector">
                <label htmlFor="language-variety">Language Variety:</label>
                <select id="language-variety" value={languageVariety} onChange={e => setLanguageVariety(e.target.value)}>
                    <option value="all">All</option>
                    <option value="american">American English</option>
                    <option value="british">British English</option>
                </select>
            </div>
            <button className="start-button" onClick={handleStart} disabled={selectedLevels.length === 0}>
                Start Practice
            </button>
        </div>
    );
};

export default IrregularVerbLevelSelector;
