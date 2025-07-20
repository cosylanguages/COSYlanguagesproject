export const logMistake = (mistake) => {
    const mistakes = getMistakes();
    mistakes.push({ ...mistake, timestamp: new Date().toISOString() });
    localStorage.setItem('mistakeNotebook', JSON.stringify(mistakes));
};

export const getMistakes = () => {
    const mistakes = localStorage.getItem('mistakeNotebook');
    return mistakes ? JSON.parse(mistakes) : [];
};
