import React from 'react';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import { useFreestyle } from '../../contexts/FreestyleContext';

const PracticeSelector = () => {
    const { selectedLanguage, selectedDays } = useFreestyle();

    return (
        <div className="practice-selector-container">
            <DaySelectorFreestyle language={selectedLanguage} />
            {selectedDays.length > 0 && (
                <PracticeCategoryNav language={selectedLanguage} days={selectedDays} />
            )}
        </div>
    );
};

export default PracticeSelector;
