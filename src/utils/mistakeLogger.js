/**
 * Logs a mistake to the mistake notebook in local storage.
 * @param {object} mistake - The mistake to log.
 * @param {string} explanation - The explanation of the mistake.
 */
export const logMistake = (mistake, explanation) => {
    const mistakes = getMistakes();
    mistakes.push({ ...mistake, timestamp: new Date().toISOString(), explanation });
    localStorage.setItem('mistakeNotebook', JSON.stringify(mistakes));
};

/**
 * Gets the list of mistakes from the mistake notebook in local storage.
 * @returns {Array} The list of mistakes.
 */
export const getMistakes = () => {
    const mistakes = localStorage.getItem('mistakeNotebook');
    return mistakes ? JSON.parse(mistakes) : [];
};
