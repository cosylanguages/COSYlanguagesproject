import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { loadAllLevelsForLanguageAsFlatList, CEFR_LEVELS as importedCefrLevels } from '../../../utils/vocabularyService'; // Import service
import './DictionaryTool.css';

// Use CEFR_LEVELS from vocabularyService if available, otherwise fallback
const CEFR_LEVELS_ORDER = importedCefrLevels || ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];


const DictionaryTool = () => {
    const { t, language: currentUILanguage, currentLangKey } = useI18n(); // currentLangKey is 'el', 'en' etc.
    const [allVocabulary, setAllVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState(''); // Empty string means all levels

    useEffect(() => {
        const loadVocabularyForCurrentLanguage = async () => {
            if (!currentLangKey) { // currentLangKey from useI18n (e.g., 'el', 'en')
                // console.log("DictionaryTool: UI language key not available yet.");
                return; // Don't load if language isn't set
            }
            // console.log(`DictionaryTool: Loading vocabulary for UI language: ${currentLangKey}`);
            setIsLoading(true);
            setError(null);
            try {
                // Use the vocabulary service to load all levels for the current UI language
                const vocabularyData = await loadAllLevelsForLanguageAsFlatList(currentLangKey);
                setAllVocabulary(vocabularyData || []);
                if (!vocabularyData || vocabularyData.length === 0) {
                    console.warn(`DictionaryTool: No vocabulary data returned for language ${currentLangKey}.`);
                }
            } catch (err) {
                console.error(`DictionaryTool: Error loading vocabulary for ${currentLangKey}:`, err);
                setError(err.message || t('dictionary.loadErrorGeneric', 'Failed to load vocabulary data.'));
                setAllVocabulary([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadVocabularyForCurrentLanguage();
    }, [currentLangKey, t]); // Depend on currentLangKey from i18n context

    const filteredVocabulary = useMemo(() => {
        if (!allVocabulary) return [];
        return allVocabulary.filter(item => {
            const itemLevel = typeof item.level === 'string' ? item.level.toLowerCase() : '';
            const matchesLevel = selectedLevel ? itemLevel === selectedLevel.toLowerCase() : true;

            const lowerSearchTerm = searchTerm.toLowerCase();
            // Ensure all searchable fields are strings before calling toLowerCase() and includes()
            const termMatch = typeof item.term === 'string' && item.term.toLowerCase().includes(lowerSearchTerm);
            const definitionMatch = typeof item.definition === 'string' && item.definition.toLowerCase().includes(lowerSearchTerm);
            const exampleMatch = typeof item.example === 'string' && item.example.toLowerCase().includes(lowerSearchTerm);
            const themeMatch = typeof item.theme === 'string' && item.theme.toLowerCase().includes(lowerSearchTerm);
            const pronunciationMatch = typeof item.pronunciation === 'string' && item.pronunciation.toLowerCase().includes(lowerSearchTerm);
            const partOfSpeechMatch = typeof item.partOfSpeech === 'string' && item.partOfSpeech.toLowerCase().includes(lowerSearchTerm);
            const latinisationMatch = typeof item.latinisation === 'string' && item.latinisation.toLowerCase().includes(lowerSearchTerm);


            const matchesSearch = searchTerm ? (
                termMatch || definitionMatch || exampleMatch || themeMatch || pronunciationMatch || partOfSpeechMatch || latinisationMatch
            ) : true;

            return matchesLevel && matchesSearch;
        });
    }, [allVocabulary, searchTerm, selectedLevel]);

    if (isLoading) return <p>{t('dictionary.loading', 'Loading dictionary...')}</p>;
    if (error) return <p className="error-message">{t('dictionary.loadError', 'Error loading dictionary: ')}{error}</p>;

    return (
        <div className="dictionary-tool">
            <h3>{t('dictionary.title', 'Vocabulary Dictionary')}</h3>
            <div className="dictionary-controls">
                <input
                    type="text"
                    className="search-dictionary"
                    placeholder={t('dictionary.searchPlaceholder', 'Search terms, definitions...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={t('dictionary.searchAriaLabel', 'Search vocabulary')}
                />
                <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="level-filter"
                    aria-label={t('dictionary.levelFilterAriaLabel', 'Filter by level')}
                >
                    <option value="">{t('dictionary.allLevels', 'All Levels')}</option>
                    {CEFR_LEVELS_ORDER.map(level => (
                        <option key={level} value={level}>{level.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {filteredVocabulary.length === 0 && !isLoading && (
                <p>{t('dictionary.noResults', 'No vocabulary items match your search criteria.')}</p>
            )}

            <div className="vocabulary-list">
                {filteredVocabulary.map((item, index) => (
                    // Use item.id if available and unique, otherwise fallback.
                    // The service currently doesn't guarantee unique IDs across themes/levels if not in source.
                    <div key={item.id || `${item.term}-${index}`} className="vocabulary-item">
                        <h4>
                            {item.term || t('dictionary.unknownTerm', 'Unknown Term')}
                            {item.level && ` (${item.level})`}
                            {item.term && <button onClick={() => pronounceText(item.term, item.lang || currentLangKey)} className="btn-icon pronounce-btn-inline" title={t('dictionary.pronounceTerm', 'Pronounce term')}>🔊</button>}
                        </h4>
                        {item.pronunciation && <p className="vocab-pronunciation"><strong>{t('dictionary.pronunciation', 'Pronunciation:')}</strong> {item.pronunciation}</p>}
                        {item.partOfSpeech && <p className="vocab-pos"><strong>{t('dictionary.partOfSpeech', 'Part of Speech:')}</strong> {item.partOfSpeech}</p>}
                        {item.gender && <p className="vocab-gender"><strong>{t('dictionary.gender', 'Gender:')}</strong> {item.gender}</p>}
                        {item.latinisation && <p className="vocab-latinisation"><strong>{t('dictionary.latinisation', 'Latinisation:')}</strong> {item.latinisation}</p>}
                        {item.definition && <p className="vocab-definition"><strong>{t('dictionary.definition', 'Definition:')}</strong> {item.definition}</p>}
                        {item.example && <p className="vocab-example"><strong>{t('dictionary.example', 'Example:')}</strong> <em>{item.example}</em></p>}
                        {/* We might want to show example_translation if available */}
                        {item.theme && <p className="vocab-theme"><small>{t('dictionary.theme', 'Theme:')} {item.theme}</small></p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DictionaryTool;
