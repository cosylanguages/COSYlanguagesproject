import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import { normalizeString } from '../../../../utils/stringUtils';
import useLatinization from '../../../../hooks/useLatinization';

// Determine common pronouns, can be expanded or made language-specific
const getPronounsForTable = (language, verbTenses) => {
    // Attempt to extract pronouns from the first available tense and its forms
    if (verbTenses && Object.keys(verbTenses).length > 0) {
        const firstTenseKey = Object.keys(verbTenses)[0];
        const firstTense = verbTenses[firstTenseKey];
        if (firstTense && firstTense.forms && Object.keys(firstTense.forms).length > 0) {
            return Object.keys(firstTense.forms);
        }
    }
    // Fallback pronouns if extraction fails (can be language-specific)
    // This is a simplified list; real applications might need more robust pronoun sets per language.
    if (language === 'COSYfrench') return ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
    if (language === 'COSYespañol') return ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'];
    if (language === 'COSYenglish') return ['i', 'you', 'he/she/it', 'we', 'they'];
    return ['pronoun1', 'pronoun2', 'pronoun3', 'pronoun4', 'pronoun5', 'pronoun6']; // Generic fallback
};


const FillConjugationTable = ({ verb, language, tensesToShow, onCheckAnswers, onSetFeedback, isRevealedExternally, onSetAllCorrect }) => {
  const { t } = useI18n();
  const getLatinizedText = useLatinization();

  const [userInputs, setUserInputs] = useState({}); // Store user inputs as { 'pronoun_tense': 'value' }
  const [solution, setSolution] = useState({}); // Store correct answers for blanked cells
  const [prefilledCells, setPrefilledCells] = useState({}); // Store cells that are pre-filled
  const [cellStatus, setCellStatus] = useState({}); // Store status of each cell: 'correct', 'incorrect', 'neutral'

  const pronouns = useMemo(() => getPronounsForTable(language, verb.tenses), [language, verb.tenses]);
  const activeTenses = useMemo(() => {
    return tensesToShow.filter(tenseKey => verb.tenses[tenseKey.toLowerCase()]);
  }, [tensesToShow, verb.tenses]);


  useEffect(() => {
    const newSolution = {};
    const newPrefilled = {};
    const initialUserInputs = {};
    const initialCellStatus = {};

    // Randomly decide which cells to make blank (e.g., 50% chance)
    // Ensure at least one blank if possible, and not too many blanks.
    let blankCount = 0;
    const totalPossibleCells = pronouns.length * activeTenses.length;
    const targetBlankCells = Math.max(1, Math.min(pronouns.length * 2, Math.floor(totalPossibleCells * 0.5))); // Aim for about 50% blanks, min 1, max 2 per pronoun avg.

    const cells = [];
    pronouns.forEach(pronoun => {
        activeTenses.forEach(tenseKey => {
            cells.push({pronoun, tenseKey});
        });
    });
    // Shuffle cells to randomize blank selection
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    cells.forEach(({pronoun, tenseKey}) => {
        const cellKey = `${pronoun}_${tenseKey}`;
        const tenseData = verb.tenses[tenseKey.toLowerCase()];
        const correctAnswer = tenseData && tenseData.forms[pronoun] ? tenseData.forms[pronoun] : '';

        if (correctAnswer) { // Only consider cells that should have an answer
            if (blankCount < targetBlankCells && Math.random() < 0.65) { // Prioritize making some cells blank
                newSolution[cellKey] = correctAnswer;
                initialUserInputs[cellKey] = '';
                blankCount++;
            } else {
                newPrefilled[cellKey] = correctAnswer;
            }
        }
        initialCellStatus[cellKey] = 'neutral';
    });

    // If no blanks were made (e.g. very small table), force one if possible
    if (blankCount === 0 && totalPossibleCells > 0) {
        for (const {pronoun, tenseKey} of cells) {
             const cellKey = `${pronoun}_${tenseKey}`;
             const tenseData = verb.tenses[tenseKey.toLowerCase()];
             const correctAnswer = tenseData && tenseData.forms[pronoun] ? tenseData.forms[pronoun] : '';
             if (correctAnswer) {
                newSolution[cellKey] = correctAnswer;
                initialUserInputs[cellKey] = '';
                delete newPrefilled[cellKey]; // Ensure it's not prefilled
                initialCellStatus[cellKey] = 'neutral';
                break;
             }
        }
    }

    setSolution(newSolution);
    setPrefilledCells(newPrefilled);
    setUserInputs(initialUserInputs);
    setCellStatus(initialCellStatus);
    if (onSetFeedback) onSetFeedback({ message: '', type: '' });

  }, [verb, language, pronouns, activeTenses, onSetFeedback]);

  useEffect(() => {
      if (isRevealedExternally) {
          const revealedInputs = {};
          const newCellStatus = { ...cellStatus };
          Object.keys(solution).forEach(cellKey => {
              revealedInputs[cellKey] = solution[cellKey].split('/')[0]; // Show first answer if multiple
              newCellStatus[cellKey] = 'revealed';
          });
          setUserInputs(revealedInputs);
          setCellStatus(newCellStatus);
      }
  }, [isRevealedExternally, solution, cellStatus]);


  const handleInputChange = (pronoun, tenseKey, value) => {
    const cellKey = `${pronoun}_${tenseKey}`;
    setUserInputs(prev => ({ ...prev, [cellKey]: value }));
    setCellStatus(prev => ({ ...prev, [cellKey]: 'neutral' })); // Reset status on change
    if (onSetFeedback) onSetFeedback({ message: '', type: '' });
  };

  const checkCellAnswers = () => {
    let allCorrectInternal = true;
    let correctCount = 0;
    const newCellStatus = { ...cellStatus };

    Object.keys(solution).forEach(cellKey => {
      const userAns = normalizeString(userInputs[cellKey] || '');
      const correctAnses = solution[cellKey].split('/').map(s => normalizeString(s));

      if (correctAnses.includes(userAns) && userAns !== '') {
        newCellStatus[cellKey] = 'correct';
        correctCount++;
      } else if (userAns === '') {
        newCellStatus[cellKey] = 'neutral'; // Keep neutral if empty
        allCorrectInternal = false; // Consider empty as not fully correct for overall status
      } else {
        newCellStatus[cellKey] = 'incorrect';
        allCorrectInternal = false;
      }
    });
    setCellStatus(newCellStatus);

    if (allCorrectInternal && Object.keys(solution).length > 0 && correctCount === Object.keys(solution).length) {
      if (onSetFeedback) onSetFeedback({ message: t('feedback.allCorrectTable', 'All filled answers are correct!'), type: 'success' });
      if (onSetAllCorrect) onSetAllCorrect(true);
    } else if (!allCorrectInternal && Object.keys(solution).length > 0) {
      if (onSetFeedback) onSetFeedback({ message: t('feedback.someIncorrectTable', 'Some answers are incorrect. Please review.'), type: 'incorrect' });
      if (onSetAllCorrect) onSetAllCorrect(false);
    } else {
      if (onSetFeedback) onSetFeedback({ message: '', type: '' }); // No input yet or no blanks
    }
    return allCorrectInternal && correctCount === Object.keys(solution).length;
  };

  // Expose checkCellAnswers via the onCheckAnswers prop from parent
  useEffect(() => {
    if (onCheckAnswers) {
      onCheckAnswers.current = checkCellAnswers;
    }
  }, [onCheckAnswers, checkCellAnswers]);


  if (!verb || !verb.tenses || activeTenses.length === 0) {
    return <p>{t('loading.noTensesForVerb', 'No tenses available for this verb or tensesToShow not configured.')}</p>;
  }
  const latinizedInfinitive = getLatinizedText(verb.infinitive, language);

  return (
    <div style={{ margin: '20px 0' }}>
      <h4>{t('labels.conjugateVerb', `Conjugate the verb: "${latinizedInfinitive}"` , {verbName: latinizedInfinitive} )}</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={tableCellStyle(true)}>{t('labels.pronoun', 'Pronoun')}</th>
            {activeTenses.map(tenseKey => (
              <th key={tenseKey} style={tableCellStyle(true)}>{getLatinizedText(tenseKey.replace(/_/g, ' '), language)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pronouns.map(pronoun => (
            <tr key={pronoun}>
              <td style={tableCellStyle()}>{getLatinizedText(pronoun, language)}</td>
              {activeTenses.map(tenseKey => {
                const cellKey = `${pronoun}_${tenseKey}`;
                const isBlank = cellKey in solution;
                const prefilledValue = prefilledCells[cellKey];
                const cellCurrentStatus = cellStatus[cellKey] || 'neutral';

                return (
                  <td key={tenseKey} style={tableCellStyle(false, cellCurrentStatus)}>
                    {isBlank ? (
                      <input
                        type="text"
                        value={userInputs[cellKey] || ''}
                        onChange={e => handleInputChange(pronoun, tenseKey, e.target.value)}
                        disabled={isRevealedExternally || cellCurrentStatus === 'correct'}
                        style={{ width: '95%', padding: '8px', fontSize: '0.95rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                        aria-label={t('ariaLabels.verbFormFor', `Verb form for {pronoun} in {tense}`, {pronoun: getLatinizedText(pronoun, language), tense: getLatinizedText(tenseKey, language)})}
                      />
                    ) : (
                      <span style={{ fontSize: '0.95rem' }}>{getLatinizedText(prefilledValue, language)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableCellStyle = (isHeader = false, status = 'neutral') => {
  let style = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    minWidth: '100px',
    backgroundColor: isHeader ? '#f2f2f2' : '#fff',
    fontWeight: isHeader ? 'bold' : 'normal',
  };
  if (!isHeader) {
    if (status === 'correct') style.backgroundColor = '#d4edda'; // Greenish for correct
    else if (status === 'incorrect') style.backgroundColor = '#f8d7da'; // Reddish for incorrect
    else if (status === 'revealed') style.backgroundColor = '#cfe2ff'; // Bluish for revealed
  }
  return style;
};

export default FillConjugationTable;
