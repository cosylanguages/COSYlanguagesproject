export const getWritingFeedback = async (text) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const feedback = [];
            if (text.length < 10) {
                feedback.push({ message: 'Try to write a longer text.', type: 'suggestion' });
            }
            if (!text.endsWith('.')) {
                feedback.push({ message: 'Sentences should end with a period.', type: 'grammar' });
            }
            resolve(feedback);
        }, 1000);
    });
};
