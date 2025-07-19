export const logMistake = (mistake) => {
    const mistakes = getMistakes();
    mistakes.push(mistake);
    localStorage.setItem('mistakes', JSON.stringify(mistakes));
};

export const getMistakes = () => {
    const mistakes = localStorage.getItem('mistakes');
    return mistakes ? JSON.parse(mistakes) : [];
};
