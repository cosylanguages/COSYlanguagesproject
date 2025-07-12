import React, { useState, useEffect } from 'react';

const FillBlanksExercise = ({ verb, onCorrect, onIncorrect }) => {
    const [answer, setAnswer] = useState('');
    const [sentence, setSentence] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');

    useEffect(() => {
        const verbForms = [
            { form: verb.pastSimple, type: 'pastSimple' },
            { form: verb.pastParticiple, type: 'pastParticiple' }
        ];
        const randomForm = verbForms[Math.floor(Math.random() * verbForms.length)];
        setCorrectAnswer(randomForm.form);

        if (verb.example) {
            const blankedSentence = verb.example.replace(new RegExp(verb.base, 'gi'), '______');
            setSentence(blankedSentence);
        } else {
            setSentence(`(No example sentence available for this verb)`);
        }
        setAnswer('');
    }, [verb]);

    const handleCheck = () => {
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            onCorrect();
        } else {
            onIncorrect();
        }
    };

    return (
        <div>
            <h3>{verb.base}</h3>
            <p>{sentence}</p>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={handleCheck}>Check</button>
        </div>
    );
};

export default FillBlanksExercise;
