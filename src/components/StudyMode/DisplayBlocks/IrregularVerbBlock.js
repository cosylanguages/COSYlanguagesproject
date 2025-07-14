import React, { useState, useEffect } from 'react';
import useIrregularVerbs from '../../../hooks/useIrregularVerbs';

const IrregularVerbBlock = ({ block, language }) => {
    const { verbs, loading, error } = useIrregularVerbs(block.levels, language);
    const [currentVerb, setCurrentVerb] = useState(null);
    const [sentence, setSentence] = useState('');
    const [answer, setAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (verbs.length > 0) {
            const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
            setCurrentVerb(randomVerb);

            const verbForms = [
                { form: randomVerb.pastSimple, type: 'pastSimple' },
                { form: randomVerb.pastParticiple, type: 'pastParticiple' }
            ];
            const randomForm = verbForms[Math.floor(Math.random() * verbForms.length)];
            setCorrectAnswer(randomForm.form);

            if (randomVerb.example) {
                const blankedSentence = randomVerb.example.replace(new RegExp(randomForm.form, 'gi'), '______');
                setSentence(blankedSentence);
            } else {
                setSentence(`(No example sentence available for this verb)`);
            }
            setAnswer('');
        }
    }, [verbs]);

    const handleCheck = () => {
        setShowAnswer(true);
    };

    const isCorrect = () => {
        return answer.toLowerCase() === correctAnswer.toLowerCase();
    };

    if (loading) {
        return <div>Loading irregular verbs...</div>;
    }

    if (error) {
        return <div>Error loading irregular verbs: {error.message}</div>;
    }

    if (!currentVerb) {
        return <div>No irregular verbs found for the selected levels.</div>;
    }

    return (
        <div>
            <h2>Irregular Verb Practice: {currentVerb.base}</h2>
            <p>{sentence}</p>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{
                    backgroundColor: showAnswer
                        ? isCorrect()
                            ? 'lightgreen'
                            : 'lightcoral'
                        : 'white'
                }}
            />
            <button onClick={handleCheck}>Check Answer</button>
            {showAnswer && (
                <span> Correct answer: {correctAnswer}</span>
            )}
        </div>
    );
};

export default IrregularVerbBlock;
