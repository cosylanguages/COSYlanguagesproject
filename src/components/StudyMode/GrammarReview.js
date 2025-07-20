import React, { useState, useEffect } from 'react';
import { getGrammarReviewSchedule } from '../../utils/srs';
import './GrammarReview.css';

const GrammarReview = () => {
    const [reviewItems, setReviewItems] = useState([]);
    const [sentence] = useState('She go to the store.');
    const [correction, setCorrection] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const schedule = getGrammarReviewSchedule();
        const now = new Date();
        const itemsToReview = Object.keys(schedule).filter(key => {
            const item = schedule[key];
            return new Date(item.nextReviewDate) <= now;
        });
        setReviewItems(itemsToReview);
    }, []);

    const handleCorrectionChange = (e) => {
        setCorrection(e.target.value);
    };

    const checkCorrection = () => {
        if (correction.toLowerCase() === 'she goes to the store.') {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    return (
        <div className="grammar-review">
            <h2>Grammar Review</h2>
            {reviewItems.length > 0 ? (
                <ul>
                    {reviewItems.map((item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No grammar items to review right now. Keep practicing!</p>
            )}

            <div className="sentence-correction">
                <h3>Sentence Correction</h3>
                <p>Correct the following sentence:</p>
                <p><em>{sentence}</em></p>
                <input
                    type="text"
                    value={correction}
                    onChange={handleCorrectionChange}
                    placeholder="Enter your correction"
                />
                <button onClick={checkCorrection}>Check</button>
                {isCorrect === true && <p className="correct">Correct!</p>}
                {isCorrect === false && <p className="incorrect">Not quite, try again.</p>}
            </div>
        </div>
    );
};

export default GrammarReview;
