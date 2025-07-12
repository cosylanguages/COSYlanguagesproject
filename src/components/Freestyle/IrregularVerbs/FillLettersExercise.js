import React, { useState, useEffect } from 'react';

const FillLettersExercise = ({ verb, onCorrect, onIncorrect }) => {
    const [pastSimpleInput, setPastSimpleInput] = useState('');
    const [pastParticipleInput, setPastParticipleInput] = useState('');

    const createMaskedVerb = (verbForm) => {
        const letters = verbForm.split('');
        const mask = letters.map(() => '_').join('');
        return mask;
    };

    const [maskedPastSimple, setMaskedPastSimple] = useState(createMaskedVerb(verb.pastSimple));
    const [maskedPastParticiple, setMaskedPastParticiple] = useState(createMaskedVerb(verb.pastParticiple));

    useEffect(() => {
        setMaskedPastSimple(createMaskedVerb(verb.pastSimple));
        setMaskedPastParticiple(createMaskedVerb(verb.pastParticiple));
        setPastSimpleInput('');
        setPastParticipleInput('');
    }, [verb]);

    const handleCheck = () => {
        if (pastSimpleInput.toLowerCase() === verb.pastSimple.toLowerCase() && pastParticipleInput.toLowerCase() === verb.pastParticiple.toLowerCase()) {
            onCorrect();
        } else {
            onIncorrect();
        }
    };

    return (
        <div>
            <h3>{verb.base}</h3>
            <div>
                <label>Past Simple:</label>
                <input
                    type="text"
                    value={pastSimpleInput}
                    onChange={(e) => setPastSimpleInput(e.target.value)}
                    placeholder={maskedPastSimple}
                />
            </div>
            <div>
                <label>Past Participle:</label>
                <input
                    type="text"
                    value={pastParticipleInput}
                    onChange={(e) => setPastParticipleInput(e.target.value)}
                    placeholder={maskedPastParticiple}
                />
            </div>
            <button onClick={handleCheck}>Check</button>
        </div>
    );
};

export default FillLettersExercise;
