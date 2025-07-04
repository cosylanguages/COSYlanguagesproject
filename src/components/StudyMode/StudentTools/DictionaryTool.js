import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import './DictionaryTool.css';

const CEFR_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

const DictionaryTool = () => {
    const { t, language: currentUILanguage } = useI18n();
    const [allVocabulary, setAllVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState(''); // Empty string means all levels

    useEffect(() => {
        const loadAllVocabulary = async () => {
            setIsLoading(true);
            setError(null);
            let combinedVocabulary = [];

            try {
                for (const level of CEFR_LEVELS) {
                    const filePath = `/data/vocabulary/en/${level}.json`; // Path within public directory
                    const response = await fetch(filePath);
                    if (!response.ok) {
                        // For this tool, we'll log a warning but try to continue with other files.
                        // A more robust solution might involve specific error handling per file.
                        console.warn(`Failed to load vocabulary for level ${level}. Status: ${response.status}`);
                        continue; // Skip to next level if one file fails
                    }
                    const levelData = await response.json();
                    // Add level information to each item if not already present (it should be)
                    const vocabularyWithLevel = levelData.map(item => ({ ...item, level: item.level || level.toUpperCase() }));
                    combinedVocabulary = [...combinedVocabulary, ...vocabularyWithLevel];
                }
                setAllVocabulary(combinedVocabulary);
            } catch (err) {
                console.error(`Error loading vocabulary:`, err);
                setError(err.message || 'Failed to load vocabulary data.');
                setAllVocabulary([]); // Clear any partial data
            } finally {
                setIsLoading(false);
            }
        };

        // For now, we assume English dictionary. Language selection can be added later.
        loadAllVocabulary();
    }, []); // Load once on mount

    const filteredVocabulary = useMemo(() => {
        return allVocabulary.filter(item => {
            const matchesLevel = selectedLevel ? item.level?.toLowerCase() === selectedLevel.toLowerCase() : true;
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = searchTerm ? (
                item.term?.toLowerCase().includes(lowerSearchTerm) ||
                item.definition?.toLowerCase().includes(lowerSearchTerm) ||
                item.example?.toLowerCase().includes(lowerSearchTerm) ||
                item.theme?.toLowerCase().includes(lowerSearchTerm)
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
                />
                <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="level-filter"
                >
                    <option value="">{t('dictionary.allLevels', 'All Levels')}</option>
                    {CEFR_LEVELS.map(level => (
                        <option key={level} value={level}>{level.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {filteredVocabulary.length === 0 && !isLoading && (
                <p>{t('dictionary.noResults', 'No vocabulary items match your search criteria.')}</p>
            )}

            <div className="vocabulary-list">
                {filteredVocabulary.map((item, index) => (
                    <div key={item.term + index} className="vocabulary-item">
                        <h4>
                            {item.term} ({item.level})
                            {item.term && <button onClick={() => pronounceText(item.term, currentUILanguage)} className="btn-icon pronounce-btn-inline">🔊</button>}
                        </h4>
                        {item.definition && <p><strong>{t('dictionary.definition', 'Definition:')}</strong> {item.definition}</p>}
                        {item.example && <p><strong>{t('dictionary.example', 'Example:')}</strong> <em>{item.example}</em></p>}
                        {item.theme && <p><small>{t('dictionary.theme', 'Theme:')} {item.theme}</small></p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DictionaryTool;
