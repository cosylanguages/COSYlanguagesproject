export const logMistake = (mistake, explanation) => {
    const mistakes = getMistakes();
    mistakes.push({ ...mistake, timestamp: new Date().toISOString(), explanation });
    localStorage.setItem('mistakeNotebook', JSON.stringify(mistakes));
};

export const getMistakes = () => {
    const mistakes = localStorage.getItem('mistakeNotebook');
    return mistakes ? JSON.parse(mistakes) : [];
};
