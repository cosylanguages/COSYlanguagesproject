export const getPronunciationFeedback = async (transcript) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const words = transcript.split(' ');
            const feedback = words.map(word => ({
                word,
                isCorrect: Math.random() > 0.2, // 80% chance of being correct
            }));
            resolve(feedback);
        }, 1000);
    });
};
