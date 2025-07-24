/**
 * Analyzes the user's performance and generates a list of items to review.
 * @param {object} performanceData - The user's performance data.
 * @returns {Array} A sorted list of items to review, with the highest priority items first.
 */
export const analyzePerformance = (performanceData) => {
    const reviewItems = [];
    const now = new Date().getTime();

    // Analyze flashcard performance.
    if (performanceData.flashcards) {
        performanceData.flashcards.forEach(card => {
            const successRate = card.correct / (card.correct + card.incorrect);
            const reviews = card.correct + card.incorrect;
            const timeSinceLastReview = now - (card.lastReviewed || 0);
            const seenCount = card.seenCount || 0;
            const avgResponseTime = card.totalResponseTime / reviews;

            // A simple priority calculation.
            let priority = 0;
            if (successRate < 0.6) priority += 3;
            if (timeSinceLastReview > 1000 * 60 * 60 * 24 * 7) priority += 2;
            if (seenCount < 3) priority += 1;
            if (avgResponseTime > 10000) priority += 1;

            if (priority > 0) {
                reviewItems.push({ ...card, id: `flashcard-${card.cardId}`, priority });
            }
        });
    }

    // Analyze grammar performance.
    if (performanceData.grammar) {
        performanceData.grammar.forEach(grammarPoint => {
            const successRate = grammarPoint.correct / (grammarPoint.correct + grammarPoint.incorrect);
            const reviews = grammarPoint.correct + grammarPoint.incorrect;
            const timeSinceLastReview = now - (grammarPoint.lastReviewed || 0);
            const seenCount = grammarPoint.seenCount || 0;
            const avgResponseTime = grammarPoint.totalResponseTime / reviews;


            // A simple priority calculation.
            let priority = 0;
            if (successRate < 0.7) priority += 3;
            if (timeSinceLastReview > 1000 * 60 * 60 * 24 * 7) priority += 2;
            if (seenCount < 3) priority += 1;
            if (avgResponseTime > 15000) priority += 1;

            if (priority > 0) {
                reviewItems.push({ ...grammarPoint, id: `grammar-${grammarPoint.grammarPointId}`, priority });
            }
        });
    }

    // Sort the review items by priority, in descending order.
    return reviewItems.sort((a, b) => b.priority - a.priority);
};
