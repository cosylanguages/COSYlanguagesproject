import React, { useState, useEffect } from 'react';
import { analyzePerformance } from '../../utils/performanceAnalyzer';
import './SmartReview.css';

const SmartReview = ({ userId }) => {
    const [reviewItems, setReviewItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch the user's performance data from a backend
        const userPerformanceData = {
            flashcards: [
                { cardId: 1, correct: 5, incorrect: 5 },
                { cardId: 2, correct: 8, incorrect: 2 },
                { cardId: 3, correct: 2, incorrect: 8 },
            ],
            grammar: [
                { grammarPointId: 1, correct: 6, incorrect: 4 },
                { grammarPointId: 2, correct: 9, incorrect: 1 },
            ],
        };

        const generatedReviewItems = analyzePerformance(userPerformanceData);
        setReviewItems(generatedReviewItems);
        setIsLoading(false);
    }, [userId]);

    if (isLoading) {
        return <p>Loading smart review...</p>;
    }

    return (
        <div className="smart-review">
            <h2>Smart Review</h2>
            {reviewItems.length > 0 ? (
                <ul>
                    {reviewItems.map((item, index) => (
                        <li key={index}>
                            {item.type}: {item.id}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items to review right now. Keep practicing!</p>
            )}
        </div>
    );
};

export default SmartReview;
