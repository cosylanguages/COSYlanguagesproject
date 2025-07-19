export const analyzePerformance = (performanceData) => {
    const reviewItems = [];

    // Analyze flashcard performance
    if (performanceData.flashcards) {
        performanceData.flashcards.forEach(card => {
            const successRate = card.correct / (card.correct + card.incorrect);
            if (successRate < 0.6) {
                reviewItems.push({ type: 'flashcard', id: card.cardId });
            }
        });
    }

    // Analyze grammar performance
    if (performanceData.grammar) {
        performanceData.grammar.forEach(grammarPoint => {
            const successRate = grammarPoint.correct / (grammarPoint.correct + grammarPoint.incorrect);
            if (successRate < 0.7) {
                reviewItems.push({ type: 'grammar', id: grammarPoint.grammarPointId });
            }
        });
    }

    return reviewItems;
};
