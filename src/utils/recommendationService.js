/**
 * Generates personalized word recommendations based on the user's favorites.
 * @param {Array} favorites - An array of the user's favorite words.
 * @param {Array} allVocabulary - An array of all vocabulary words.
 * @param {Array} searchHistory - An array of the user's search history.
 * @returns {Array} An array of recommended words.
 */
export function generateRecommendations(favorites, allVocabulary, searchHistory) {
    if (!favorites || favorites.length === 0) {
        return [];
    }

    const favoriteTerms = favorites.map(fav => fav.term);
    const historyTerms = searchHistory.map(item => item);

    const recommendations = [];

    for (const favorite of favorites) {
        const favoriteDay = allVocabulary.find(word => word.term === favorite.term)?.day;
        if (favoriteDay) {
            const relatedWords = allVocabulary.filter(word => word.day === favoriteDay && !favoriteTerms.includes(word.term) && !historyTerms.includes(word.term));
            recommendations.push(...relatedWords);
        }
    }

    // Remove duplicates and limit the number of recommendations
    const uniqueRecommendations = [...new Set(recommendations.map(word => word.term))]
        .map(term => recommendations.find(word => word.term === term));

    return uniqueRecommendations.slice(0, 10);
}
