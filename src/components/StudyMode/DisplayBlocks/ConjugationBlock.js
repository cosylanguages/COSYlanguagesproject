import React, { useState, useEffect } from 'react';
import { loadConjugationData } from '../../../utils/conjugationDataService';

const ConjugationBlock = ({ block, language }) => {
    const [conjugationData, setConjugationData] = useState(null);
    const [currentVerb, setCurrentVerb] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);

    useEffect(() => {
        const fetchConjugationData = async () => {
            const { data } = await loadConjugationData(language);
            setConjugationData(data);
        };

        if (language) {
            fetchConjugationData();
        }
    }, [language]);

    useEffect(() => {
        if (conjugationData) {
            const verbs = conjugationData.verbs;
            const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
            setCurrentVerb(randomVerb);
            // Initialize user answers state
            const initialAnswers = {};
            if (randomVerb && randomVerb.tenses) {
                randomVerb.tenses.forEach(tense => {
                    tense.forms.forEach(form => {
                        initialAnswers[`${tense.name}-${form.pronoun}`] = '';
                    });
                });
            }
            setUserAnswers(initialAnswers);
        }
    }, [conjugationData]);

    const handleInputChange = (tenseName, pronoun, value) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [`${tenseName}-${pronoun}`]: value,
        }));
    };

    const checkAnswers = () => {
        setShowAnswers(true);
    };

    const isCorrect = (tenseName, pronoun, userAnswer) => {
        const correctAnswer = currentVerb.tenses
            .find(t => t.name === tenseName)
            .forms.find(f => f.pronoun === pronoun).form;
        return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    };

    if (!currentVerb) {
        return <div>Loading conjugation exercise...</div>;
    }

    return (
        <div>
            <h2>Conjugation Practice: {currentVerb.verb}</h2>
            {currentVerb.tenses.map(tense => (
                <div key={tense.name}>
                    <h3>{tense.name}</h3>
                    {tense.forms.map(form => (
                        <div key={form.pronoun}>
                            <label>{form.pronoun}</label>
                            <input
                                type="text"
                                value={userAnswers[`${tense.name}-${form.pronoun}`]}
                                onChange={e => handleInputChange(tense.name, form.pronoun, e.target.value)}
                                style={{
                                    backgroundColor: showAnswers
                                        ? isCorrect(tense.name, form.pronoun, userAnswers[`${tense.name}-${form.pronoun}`])
                                            ? 'lightgreen'
                                            : 'lightcoral'
                                        : 'white'
                                }}
                            />
                            {showAnswers && (
                                <span> Correct answer: {form.form}</span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={checkAnswers}>Check Answers</button>
        </div>
    );
};

export default ConjugationBlock;
