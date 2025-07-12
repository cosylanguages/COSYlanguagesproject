import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './IrregularVerbsTool.css';

const IrregularVerbsTool = () => {
    const { t, language: currentUILanguage } = useI18n();
    const [verbs, setVerbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConjugationData, setIsConjugationData] = useState(false);
    const [noDataForLanguage, setNoDataForLanguage] = useState(false); // New state for missing data

    useEffect(() => {
        const loadVerbs = async () => {
            setIsLoading(true);
            setError(null);
            setVerbs([]);
            setIsConjugationData(false);
            setNoDataForLanguage(false); // Reset this state on each load attempt

            let filePath = '';
            let dataIsConjugations = false;

            // Determine file path based on language (similar to old system)
            if (currentUILanguage === 'COSYfrançais') {
                filePath = `/data/grammar/verbs/conjugations/conjugations_french.json`; // Assuming files are in public folder
                dataIsConjugations = true;
            } else if (currentUILanguage === 'COSYenglish') {
                filePath = `/data/grammar/verbs/irregular/irregular_verbs_en.json`;
            } else {
                const langFileNamePart = currentUILanguage.replace('COSY', '').toLowerCase();
                filePath = `/data/grammar/verbs/irregular/irregular_verbs_${langFileNamePart}.json`;
            }

            setIsConjugationData(dataIsConjugations);

            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    if (response.status === 404) {
                        setNoDataForLanguage(true); // Set specific state for 404
                        console.warn(`Irregular verbs data not found for ${currentUILanguage} at ${filePath}.`);
                        setVerbs([]); // Ensure verbs list is empty
                        // No error thrown here for 404, will be handled by conditional rendering
                    } else {
                        // For other HTTP errors, still treat as a general error
                        throw new Error(t('irregularVerbsLoadHttpError', { status: response.status }) || `Failed to load data: ${response.status}`);
                    }
                } else { // response.ok, proceed to parse JSON
                    const data = await response.json();
                    if (dataIsConjugations) {
                        setVerbs(data.verbs || []);
                    } else {
                        setVerbs(Array.isArray(data) ? data : []);
                    }
                }
            } catch (err) { // This will now primarily catch non-404 fetch errors or JSON parsing errors
                console.error(`Error loading irregular verbs for ${currentUILanguage} from ${filePath}:`, err);
                // If we are in this catch, it's a non-404 error, so set the general error.
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

        if (isConjugationData) { // French conjugation data
            return verbs.filter(verb =>
                verb.infinitive?.toLowerCase().includes(lowerSearchTerm)
            );
        } else { // Standard irregular verbs
            return verbs.filter(verb =>
                verb.base?.toLowerCase().includes(lowerSearchTerm) ||
                verb.pastSimple?.toLowerCase().includes(lowerSearchTerm) ||
                verb.pastParticiple?.toLowerCase().includes(lowerSearchTerm) ||
                // We don't use translations
                (verb.translation && typeof verb.translation === 'string' && verb.translation.toLowerCase().includes(lowerSearchTerm))
            );
        }
    }, [verbs, searchTerm, isConjugationData]);

    if (isLoading) return <p>{t('loadingIrregularVerbs') || 'Loading irregular verbs...'}</p>;

    // Display message if no data is available for the language
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

    // Display general error message if one occurred (and not handled by noDataForLanguage)
    if (error) return <p className="error-message">{error}</p>;

    const titleText = currentUILanguage === 'COSYenglish'
        ? t('irregularVerbsToolTitle', 'Irregular Verbs List')
        : t('conjugationsToolTitle', 'Conjugations List');

    return (
        <div className="irregular-verbs-tool">
            <h3>{titleText} ({currentUILanguage.replace('COSY','')})</h3>
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

            {isConjugationData ? ( // Display for French conjugations
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
            ) : ( // Display for standard irregular verbs
                <table className="irregular-verbs-table">
                    <thead>
                        <tr>
                            <th>{t('verbHeaderBase') || 'Base'}</th>
                            <th>{t('verbHeaderPastSimple') || 'Past Simple'}</th>
                            <th>{t('verbHeaderPastParticiple') || 'Past Participle'}</th>
                            <th>{t('verbHeaderTranslation') || 'Translation'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVerbs.map((verb, index) => (
                            <tr key={verb.id || verb.base || index}>
                                <td>{verb.base} {verb.base && <button onClick={() => pronounceText(verb.base, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.pastSimple} {verb.pastSimple && <button onClick={() => pronounceText(verb.pastSimple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.pastParticiple} {verb.pastParticiple && <button onClick={() => pronounceText(verb.pastParticiple, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                                <td>{verb.translation} {verb.translation && <button onClick={() => pronounceText(verb.translation, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IrregularVerbsTool;
