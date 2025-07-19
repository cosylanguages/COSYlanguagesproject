import React, { useState, useEffect } from 'react';
import { getGrammarReviewSchedule } from '../../utils/srs';
import './GrammarReview.css';

const GrammarReview = () => {
    const [reviewItems, setReviewItems] = useState([]);

    useEffect(() => {
        const schedule = getGrammarReviewSchedule();
        const now = new Date();
        const itemsToReview = Object.keys(schedule).filter(key => {
            const item = schedule[key];
            return new Date(item.nextReviewDate) <= now;
        });
        setReviewItems(itemsToReview);
    }, []);

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
        </div>
    );
};

export default GrammarReview;
