import React, { useState } from 'react';

const UserBoosterPackCreator = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [vocabulary, setVocabulary] = useState([{ term: '', definition: '' }]);
    const [phrases, setPhrases] = useState(['']);

    const handleVocabChange = (index, field, value) => {
        const newVocabulary = [...vocabulary];
        newVocabulary[index][field] = value;
        setVocabulary(newVocabulary);
    };

    const addVocabField = () => {
        setVocabulary([...vocabulary, { term: '', definition: '' }]);
    };

    const handlePhraseChange = (index, value) => {
        const newPhrases = [...phrases];
        newPhrases[index] = value;
        setPhrases(newPhrases);
    };

    const addPhraseField = () => {
        setPhrases([...phrases, '']);
    };

    const saveBoosterPack = () => {
        const newBoosterPack = {
            id: Date.now(),
            title,
            description,
            content: {
                vocabulary,
                phrases,
            },
        };

        const existingPacks = JSON.parse(localStorage.getItem('userBoosterPacks')) || [];
        localStorage.setItem('userBoosterPacks', JSON.stringify([...existingPacks, newBoosterPack]));

        // Clear form
        setTitle('');
        setDescription('');
        setVocabulary([{ term: '', definition: '' }]);
        setPhrases(['']);
    };

    return (
        <div className="user-booster-pack-creator">
            <h2>Create Your Own Booster Pack</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <h3>Vocabulary</h3>
            {vocabulary.map((vocab, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Term"
                        value={vocab.term}
                        onChange={(e) => handleVocabChange(index, 'term', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Definition"
                        value={vocab.definition}
                        onChange={(e) => handleVocabChange(index, 'definition', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addVocabField}>Add Vocabulary</button>

            <h3>Phrases</h3>
            {phrases.map((phrase, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Phrase"
                        value={phrase}
                        onChange={(e) => handlePhraseChange(index, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addPhraseField}>Add Phrase</button>

            <button onClick={saveBoosterPack}>Save Booster Pack</button>
        </div>
    );
};

export default UserBoosterPackCreator;
