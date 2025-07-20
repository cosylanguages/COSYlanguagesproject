import React, { useState, useEffect } from 'react';
import { analyzePerformance } from '../../utils/performanceAnalyzer';
import { getGrammarReviewSchedule } from '../../utils/srs';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import Flashcard from '../Common/Flashcard';
import './SmartReview.css';

const SmartReview = ({ userId }) => {
    const [reviewItems, setReviewItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    useEffect(() => {
        // In a real app, we would fetch the user's performance data from a backend
        const userPerformanceData = {
            flashcards: [
                { cardId: 1, correct: 5, incorrect: 5, lastReviewed: new Date().getTime() - 1000 * 60 * 60 * 24 * 8, type: 'flashcard', front: 'Hello', back: 'Bonjour' },
                { cardId: 2, correct: 8, incorrect: 2, lastReviewed: new Date().getTime(), type: 'flashcard', front: 'Goodbye', back: 'Au revoir' },
            ],
            grammar: [
                { grammarPointId: 1, correct: 6, incorrect: 4, lastReviewed: new Date().getTime(), type: 'multiple-choice', question: 'Which is the correct article for "livre"?', options: ['le', 'la', 'les'], correctAnswer: 'le' },
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

    const handleAnswered = (isCorrect) => {
        // In a real app, we would update the user's performance data
        console.log(`Answered correctly: ${isCorrect}`);
        setTimeout(() => {
            setCurrentItemIndex(currentItemIndex + 1);
        }, 1000);
    };

    if (isLoading) {
        return <p>Loading smart review...</p>;
    }

    if (currentItemIndex >= reviewItems.length) {
        return <p>No more items to review right now. Keep practicing!</p>;
    }

    const currentItem = reviewItems[currentItemIndex];

    const renderReviewItem = () => {
        switch (currentItem.type) {
            case 'flashcard':
                return <Flashcard front={currentItem.front} back={currentItem.back} onAnswered={handleAnswered} />;
            case 'multiple-choice':
                return <MultipleChoiceQuestion question={currentItem.question} options={currentItem.options} correctAnswer={currentItem.correctAnswer} onAnswered={handleAnswered} />;
            default:
                return <p>Unknown review item type: {currentItem.type}</p>;
        }
    };

    return (
        <div className="smart-review">
            <h2>Smart Review</h2>
            {renderReviewItem()}
        </div>
    );
};

export default SmartReview;
