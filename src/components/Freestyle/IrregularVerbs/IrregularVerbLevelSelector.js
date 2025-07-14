import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CosyLanguageSelector from '../../LanguageSelector/CosyLanguageSelector';
import './IrregularVerbLevelSelector.css';

const IrregularVerbLevelSelector = () => {
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [language, setLanguage] = useState('en');
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
        navigate(`/freestyle/irregular-verbs/practice?levels=${selectedLevels.join(',')}&lang=${language}`);
    };

    return (
        <div className="level-selector-container">
            <h2>Select Irregular Verb Levels</h2>
            <CosyLanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
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
            <button className="start-button" onClick={handleStart} disabled={selectedLevels.length === 0}>
                Start Practice
            </button>
        </div>
    );
};

export default IrregularVerbLevelSelector;
