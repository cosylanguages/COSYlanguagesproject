export const analyzePerformance = (performanceData) => {
    const reviewItems = [];
    const now = new Date().getTime();

    // Analyze flashcard performance
    if (performanceData.flashcards) {
        performanceData.flashcards.forEach(card => {
            const successRate = card.correct / (card.correct + card.incorrect);
            const reviews = card.correct + card.incorrect;
            const timeSinceLastReview = now - (card.lastReviewed || 0);

            // more sophisticated logic
            if (successRate < 0.6 || (reviews > 5 && timeSinceLastReview > 1000 * 60 * 60 * 24 * 7)) {
                reviewItems.push({ type: 'flashcard', id: card.cardId });
            }
        });
    }

    // Analyze grammar performance
    if (performanceData.grammar) {
        performanceData.grammar.forEach(grammarPoint => {
            const successRate = grammarPoint.correct / (grammarPoint.correct + grammarPoint.incorrect);
            const reviews = grammarPoint.correct + grammarPoint.incorrect;
            const timeSinceLastReview = now - (grammarPoint.lastReviewed || 0);

            // more sophisticated logic
            if (successRate < 0.7 || (reviews > 5 && timeSinceLastReview > 1000 * 60 * 60 * 24 * 7)) {
                reviewItems.push({ type: 'grammar', id: grammarPoint.grammarPointId });
            }
        });
    }

    return reviewItems;
};
