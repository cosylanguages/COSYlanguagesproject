import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import { normalizeString } from '../../../../utils/stringUtils';
import useLatinization from '../../../../hooks/useLatinization'; // Though not strictly needed for English, good for consistency

const IrregularVerbQuiz = ({
  verb, // { base, pastSimple, pastParticiple, translation }
  language,
  onCheckAnswer,
  onSetFeedback,
  isRevealedExternally,
  onSetCorrect
}) => {
  const { t } = useI18n();
  const getLatinizedText = useLatinization(); // Using for consistency, though English won't change

  const [pastSimpleInput, setPastSimpleInput] = useState('');
  const [pastParticipleInput, setPastParticipleInput] = useState('');
  const [isPastSimpleCorrect, setIsPastSimpleCorrect] = useState(null); // null, true, false
  const [isPastParticipleCorrect, setIsPastParticipleCorrect] = useState(null); // null, true, false
  const [isFullyAnswered, setIsFullyAnswered] = useState(false);


  useEffect(() => {
    setPastSimpleInput('');
    setPastParticipleInput('');
    setIsPastSimpleCorrect(null);
    setIsPastParticipleCorrect(null);
    setIsFullyAnswered(false);
    if (onSetFeedback) onSetFeedback({ message: '', type: '' });
    if (onSetCorrect) onSetCorrect(false);
  }, [verb, onSetFeedback, onSetCorrect]);

  useEffect(() => {
    if (isRevealedExternally && !isFullyAnswered) {
      setPastSimpleInput(verb.pastSimple.split('/')[0]);
      setPastParticipleInput(verb.pastParticiple.split('/')[0]);
      setIsPastSimpleCorrect(true);
      setIsPastParticipleCorrect(true);
      setIsFullyAnswered(true);
      if (onSetCorrect) onSetCorrect(true);
      if (onSetFeedback) {
        onSetFeedback({
          message: t('feedback.answersRevealedIrregular', `Base: {base}, Past Simple: {ps}, Past Participle: {pp}`, {
            base: verb.base,
            ps: verb.pastSimple,
            pp: verb.pastParticiple,
          }),
          type: 'info',
        });
      }
    }
  }, [isRevealedExternally, verb, isFullyAnswered, onSetCorrect, onSetFeedback, t]);

  const checkForms = React.useCallback(() => {
    if (isFullyAnswered && !isRevealedExternally) return;

    const normalizedPSInput = normalizeString(pastSimpleInput);
    const normalizedPPInput = normalizeString(pastParticipleInput);

    const correctPastSimples = verb.pastSimple.split('/').map(s => normalizeString(s));
    const correctPastParticiples = verb.pastParticiple.split('/').map(s => normalizeString(s));

    const psCorrect = correctPastSimples.includes(normalizedPSInput);
    const ppCorrect = correctPastParticiples.includes(normalizedPPInput);

    setIsPastSimpleCorrect(psCorrect);
    setIsPastParticipleCorrect(ppCorrect);

    if (psCorrect && ppCorrect) {
      if (onSetFeedback) onSetFeedback({ message: t('feedback.correctAllForms', 'Correct! All forms are right.'), type: 'success' });
      if (onSetCorrect) onSetCorrect(true);
      setIsFullyAnswered(true);
      return true;
    } else {
      let messages = [];
      if (!psCorrect && pastSimpleInput) messages.push(t('feedback.pastSimpleIncorrect', 'Past Simple is incorrect.'));
      if (!ppCorrect && pastParticipleInput) messages.push(t('feedback.pastParticipleIncorrect', 'Past Participle is incorrect.'));
      if (pastSimpleInput === '' || pastParticipleInput === '') messages.push(t('feedback.fillAllForms', 'Please fill in both forms.'));

      if (onSetFeedback) onSetFeedback({ message: messages.join(' ') || t('feedback.tryAgain', 'Try again.'), type: 'incorrect' });
      if (onSetCorrect) onSetCorrect(false);
      setIsFullyAnswered(false);
      return false;
    }
  }, [
    isFullyAnswered, isRevealedExternally, pastSimpleInput, pastParticipleInput,
    verb, onSetFeedback, t, onSetCorrect, setIsPastSimpleCorrect,
    setIsPastParticipleCorrect, setIsFullyAnswered
  ]);

  useEffect(() => {
    if (onCheckAnswer) {
      onCheckAnswer.current = checkForms;
    }
  }, [onCheckAnswer, checkForms]);


  const inputGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping on small screens
    alignItems: 'center',
    justifyContent: 'center', // Center items in the flex container
    marginBottom: '15px',
    gap: '10px', // Gap between label and input
  };

  const labelStyle = {
    // marginRight: '10px', // Replaced by gap
    minWidth: '120px', // Give label some minimum width
    textAlign: 'right', // Align text to the right for labels
    flexBasis: '120px', // Basis for label width
  };

  const inputStyle = (isCorrect) => ({
    padding: '8px',
    fontSize: '1rem',
    border: `1px solid ${isCorrect === false ? 'red' : (isCorrect === true ? 'green' : '#ccc')}`,
    borderRadius: '4px',
    width: 'clamp(150px, 60%, 200px)', // Responsive width
    boxSizing: 'border-box',
    textAlign: 'center',
  });


  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '1.2em', textAlign: 'center' }}>
        {t('labels.verbBaseForm', `Verb (Base Form):`)} {getLatinizedText(verb.base, language)}
      </p>
      <div style={inputGroupStyle}>
        <label htmlFor="pastSimple" style={labelStyle}>
          {t('labels.pastSimple', `Past Simple:`)}
        </label>
        <input
          type="text"
          id="pastSimple"
          value={pastSimpleInput}
          onChange={e => {
            setPastSimpleInput(e.target.value);
            setIsPastSimpleCorrect(null);
            setIsFullyAnswered(false);
            if (onSetCorrect) onSetCorrect(false);
            if (onSetFeedback) onSetFeedback({message: '', type: ''});
          }}
          disabled={isFullyAnswered && !isRevealedExternally}
          style={inputStyle(isPastSimpleCorrect)}
          aria-label={t('ariaLabels.pastSimpleInput', "Past simple input")}
        />
      </div>
      <div style={inputGroupStyle}>
        <label htmlFor="pastParticiple" style={labelStyle}>
          {t('labels.pastParticiple', `Past Participle:`)}
        </label>
        <input
          type="text"
          id="pastParticiple"
          value={pastParticipleInput}
          onChange={e => {
            setPastParticipleInput(e.target.value);
            setIsPastParticipleCorrect(null);
            setIsFullyAnswered(false);
            if (onSetCorrect) onSetCorrect(false);
            if (onSetFeedback) onSetFeedback({message: '', type: ''});
          }}
          disabled={isFullyAnswered && !isRevealedExternally}
          style={inputStyle(isPastParticipleCorrect)}
          aria-label={t('ariaLabels.pastParticipleInput', "Past participle input")}
        />
      </div>
    </div>
  );
};

export default IrregularVerbQuiz;
