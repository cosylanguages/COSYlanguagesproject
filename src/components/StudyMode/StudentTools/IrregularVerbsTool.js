import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { getStudySets, addCardToSet } from '../../../utils/studySetService';
import IrregularVerbsPractice from '../../Freestyle/IrregularVerbs/IrregularVerbsPractice'; // Import the practice component
import './IrregularVerbsTool.css';
import irregularVerbsEn from '../../../data/grammar/verbs/irregular/irregular_verbs_en.json';
import irregularVerbsEs from '../../../data/grammar/verbs/irregular/irregular_verbs_es.json';
import irregularVerbsDe from '../../../data/grammar/verbs/irregular/irregular_verbs_de.json';
import conjugationsFr from '../../../data/grammar/verbs/conjugations/conjugations_french.json';

const IrregularVerbsTool = () => {
    const { t, language: currentUILanguage } = useI18n();
    const [verbs, setVerbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [noDataForLanguage, setNoDataForLanguage] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(false); // State to toggle practice mode

    const handleAddVerbToFlashcards = (verb) => {
        const studySets = getStudySets();
        if (studySets.length === 0) {
            alert("Please create a study set first.");
            return;
        }
        const firstSetId = studySets[0].id;
        const cardData = {
            term1: verb.base,
            term2: `${verb.pastSimple}, ${verb.pastParticiple}`,
            notes: verb.translation
        };
        addCardToSet(firstSetId, cardData);
        alert(`Verb "${verb.base}" added to study set "${studySets[0].name}".`);
    };

    useEffect(() => {
        const loadVerbs = () => {
            setIsLoading(true);
            setError(null);
            setVerbs([]);
            setNoDataForLanguage(false);

            if (currentUILanguage === 'COSYenglish') {
                const allVerbs = irregularVerbsEn.reduce((acc, category) => {
                    return acc.concat(category.verbs);
                }, []);
                setVerbs(allVerbs);
            } else if (currentUILanguage === 'COSYdeutsch') {
                const allVerbs = irregularVerbsDe.reduce((acc, category) => {
                    return acc.concat(category.verbs);
                }, []);
                setVerbs(allVerbs);
            } else if (currentUILanguage === 'COSYespañol') {
                const allVerbs = irregularVerbsEs.reduce((acc, category) => {
                    return acc.concat(category.verbs);
                }, []);
                setVerbs(allVerbs);
            } else if (currentUILanguage === 'COSYfrançais') {
                setVerbs(conjugationsFr.verbs || []);
            } else {
                setNoDataForLanguage(true);
            }
            setIsLoading(false);
        };

        if (currentUILanguage) {
            loadVerbs();
        }
    }, [currentUILanguage, t]);

    const groupedAndFilteredVerbs = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        const filtered = verbs.filter(verb =>
            verb.base?.toLowerCase().includes(lowerSearchTerm) ||
            verb.pastSimple?.toLowerCase().includes(lowerSearchTerm) ||
            verb.pastParticiple?.toLowerCase().includes(lowerSearchTerm) ||
            (verb.translation && typeof verb.translation === 'string' && verb.translation.toLowerCase().includes(lowerSearchTerm))
        );

        if (!searchTerm) {
            return filtered.reduce((acc, verb) => {
                const firstLetter = verb.base[0].toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(verb);
                return acc;
            }, {});
        }
        return { 'Search Results': filtered };

    }, [verbs, searchTerm]);

    // If in practice mode, render the IrregularVerbsPractice component
    if (isPracticeMode) {
        return <IrregularVerbsPractice />;
    }

    if (isLoading) return <p>{t('loadingIrregularVerbs') || 'Loading irregular verbs...'}</p>;

    if (noDataForLanguage) {
        const titleText = currentUILanguage === 'COSYenglish'
            ? t('irregularVerbsToolTitle', 'Irregular Verbs List')
            : t('conjugationsToolTitle', 'Conjugations List');
        return (
            <div className="irregular-verbs-tool">
                <h3>{titleText} ({currentUILanguage.replace('COSY','')})</h3>
                <p>{t('irregularVerbsNotAvailableForLang', { lang: currentUILanguage.replace('COSY','') }) || `Irregular verbs data is not yet available for ${currentUILanguage.replace('COSY','')}.`}</p>
            </div>
        );
    }

    if (error) return <p className="error-message">{error}</p>;

    const titleText = currentUILanguage === 'COSYenglish'
        ? t('irregularVerbsToolTitle', 'Irregular Verbs List')
        : t('conjugationsToolTitle', 'Conjugations List');

    return (
        <div className="irregular-verbs-tool">
            <div className="tool-header">
                <h3>{titleText} ({currentUILanguage.replace('COSY','')})</h3>
                <button onClick={() => setIsPracticeMode(true)} className="btn-primary">
                    {t('practiceButton', 'Practice')}
                </button>
            </div>
            <input
                type="text"
                className="search-irregular-verbs"
                placeholder={t('searchVerbsPlaceholder') || 'Search verbs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {Object.keys(groupedAndFilteredVerbs).length === 0 && !isLoading && (
                <p>{t('noIrregularVerbsFound') || 'No irregular verbs found for this language or search term.'}</p>
            )}

            <div className="irregular-verbs-list">
                {Object.entries(groupedAndFilteredVerbs).map(([letter, verbs]) => (
                    <details key={letter} open={searchTerm.length > 0}>
                        <summary>{letter}</summary>
                        <div className="verb-cards-container">
                            {verbs.map((verb, index) => (
                                <div key={verb.id || verb.base || index} className="verb-card">
                                    <div className="verb-card-header">
                                        <h4>{verb.base}</h4>
                                        <button className="btn-icon" onClick={() => handleAddVerbToFlashcards(verb)}>➕</button>
                                    </div>
                                    <div className="verb-card-body">
                                        <p><strong>Past Simple:</strong> {verb.pastSimple}</p>
                                        <p><strong>Past Participle:</strong> {verb.pastParticiple}</p>
                                        <p><strong>Translation:</strong> {verb.translation}</p>
                                    </div>
                                    <div className="verb-card-footer">
                                        <button onClick={() => pronounceText(verb.base, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>
                                        <button onClick={() => pronounceText(verb.pastSimple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>
                                        <button onClick={() => pronounceText(verb.pastParticiple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default IrregularVerbsTool;
