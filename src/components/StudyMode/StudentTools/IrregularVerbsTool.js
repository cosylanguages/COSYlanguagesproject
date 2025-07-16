import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { getStudySets, addCardToSet } from '../../../utils/studySetService';
import IrregularVerbsPractice from '../../Freestyle/IrregularVerbs/IrregularVerbsPractice'; // Import the practice component
import './IrregularVerbsTool.css';

const IrregularVerbsTool = () => {
    const { t, language: currentUILanguage } = useI18n();
    const [verbs, setVerbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConjugationData, setIsConjugationData] = useState(false);
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
        const loadVerbs = async () => {
            setIsLoading(true);
            setError(null);
            setVerbs([]);
            setIsConjugationData(false);
            setNoDataForLanguage(false);

            let filePath = '';
            let dataIsConjugations = false;

            let langFileNamePart = currentUILanguage.replace('COSY', '').toLowerCase();
            if (langFileNamePart === 'english') {
                langFileNamePart = 'en';
            }
            if (currentUILanguage === 'COSYfrançais') {
                filePath = `/data/grammar/verbs/conjugations/conjugations_french.json`;
                dataIsConjugations = true;
            } else {
                filePath = `/data/grammar/verbs/irregular/irregular_verbs_${langFileNamePart}.json`;
            }

            setIsConjugationData(dataIsConjugations);

            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    if (response.status === 404) {
                        setNoDataForLanguage(true);
                        console.warn(`Irregular verbs data not found for ${currentUILanguage} at ${filePath}.`);
                        setVerbs([]);
                    } else {
                        throw new Error(t('irregularVerbsLoadHttpError', { status: response.status }) || `Failed to load data: ${response.status}`);
                    }
                } else {
                    const text = await response.text();
                    const data = JSON.parse(text);
                    if (dataIsConjugations) {
                        setVerbs(data.verbs || []);
                    } else {
                        const allVerbs = data.reduce((acc, category) => {
                            return acc.concat(category.verbs);
                        }, []);
                        setVerbs(allVerbs);
                    }
                }
            } catch (err) {
                console.error(`Error loading irregular verbs for ${currentUILanguage} from ${filePath}:`, err);
                setError(err.message);
                setVerbs([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUILanguage) {
            loadVerbs();
        }
    }, [currentUILanguage, t]);

    const filteredVerbs = useMemo(() => {
        if (!searchTerm) return verbs;
        const lowerSearchTerm = searchTerm.toLowerCase();

        if (isConjugationData) {
            return verbs.filter(verb =>
                verb.infinitive?.toLowerCase().includes(lowerSearchTerm)
            );
        } else {
            return verbs.filter(verb =>
                verb.base?.toLowerCase().includes(lowerSearchTerm) ||
                verb.pastSimple?.toLowerCase().includes(lowerSearchTerm) ||
                verb.pastParticiple?.toLowerCase().includes(lowerSearchTerm) ||
                (verb.translation && typeof verb.translation === 'string' && verb.translation.toLowerCase().includes(lowerSearchTerm))
            );
        }
    }, [verbs, searchTerm, isConjugationData]);

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

            {filteredVerbs.length === 0 && !isLoading && (
                <p>{t('noIrregularVerbsFound') || 'No irregular verbs found for this language or search term.'}</p>
            )}

            {isConjugationData ? (
                <div className="conjugation-table-container">
                    {filteredVerbs.map((verb, index) => (
                        <div key={verb.infinitive || index} className="conjugation-verb-entry">
                            <h4>{verb.infinitive}</h4>
                            {verb.tenses && Object.entries(verb.tenses).map(([tenseName, forms]) => (
                                <div key={tenseName} className="tense-section">
                                    <h5>{tenseName}</h5>
                                    <ul>
                                        {Object.entries(forms).map(([pronoun, form]) => (
                                            <li key={pronoun}>
                                                <strong>{pronoun}:</strong> {form}
                                                {form && <button onClick={() => pronounceText(form, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <table className="irregular-verbs-table">
                    <thead>
                        <tr>
                            <th>{t('verbHeaderBase') || 'Base'}</th>
                            <th>{t('verbHeaderPastSimple') || 'Past Simple'}</th>
                            <th>{t('verbHeaderPastParticiple') || 'Past Participle'}</th>
                            <th>{t('verbHeaderTranslation') || 'Translation'}</th>
                            <th>{t('verbHeaderAddToFlashcards') || 'Add'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVerbs.map((verb, index) => (
                            <tr key={verb.id || verb.base || index}>
                                <td>{verb.base} {verb.base && <button onClick={() => pronounceText(verb.base, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.pastSimple} {verb.pastSimple && <button onClick={() => pronounceText(verb.pastSimple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.pastParticiple} {verb.pastParticiple && <button onClick={() => pronounceText(verb.pastParticiple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.translation} {verb.translation && <button onClick={() => pronounceText(verb.translation, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td><button className="btn-icon" onClick={() => handleAddVerbToFlashcards(verb)}>➕</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IrregularVerbsTool;
