import React, { useState, useEffect } from 'react';
import { analyzePerformance } from '../../utils/performanceAnalyzer';
import { getGrammarReviewSchedule } from '../../utils/srs';
import './SmartReview.css';

const SmartReview = ({ userId }) => {
    const [reviewItems, setReviewItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch the user's performance data from a backend
        const userPerformanceData = {
            flashcards: [
                { cardId: 1, correct: 5, incorrect: 5, lastReviewed: new Date().getTime() - 1000 * 60 * 60 * 24 * 8 },
                { cardId: 2, correct: 8, incorrect: 2, lastReviewed: new Date().getTime() },
                { cardId: 3, correct: 2, incorrect: 8, lastReviewed: new Date().getTime() },
            ],
            grammar: [
                { grammarPointId: 1, correct: 6, incorrect: 4, lastReviewed: new Date().getTime() },
                { grammarPointId: 2, correct: 9, incorrect: 1, lastReviewed: new Date().getTime() },
            ],
        };

        const performanceBasedReviewItems = analyzePerformance(userPerformanceData);

        const schedule = getGrammarReviewSchedule();
        const now = new Date();
        const srsReviewItems = Object.keys(schedule)
            .filter(key => {
                const item = schedule[key];
                return new Date(item.nextReviewDate) <= now;
            })
            .map(key => ({ type: 'grammar', id: key }));

        const combinedReviewItems = [...performanceBasedReviewItems, ...srsReviewItems];
        const uniqueReviewItems = Array.from(new Set(combinedReviewItems.map(a => a.id)))
            .map(id => {
                return combinedReviewItems.find(a => a.id === id)
            });


        setReviewItems(uniqueReviewItems);
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
