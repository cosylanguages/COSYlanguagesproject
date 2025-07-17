import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { getStudySets, addCardToSet } from '../../../utils/studySetService';
import { loadAllLevelsForLanguageAsFlatList } from '../../../utils/vocabularyService';
import SearchableCardList from '../../Common/SearchableCardList';
import './DictionaryTool.css';

const DictionaryTool = ({ isOpen, onClose }) => {
    const { t } = useI18n();
    const { lang } = useParams();
    const [allVocabulary, setAllVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVocabulary = async () => {
            if (!lang || !isOpen) return;
            setIsLoading(true);
            try {
                const vocabularyData = await loadAllLevelsForLanguageAsFlatList(lang);
                setAllVocabulary(vocabularyData || []);
            } catch (err) {
                setError(err.message || 'Failed to load vocabulary data.');
            } finally {
                setIsLoading(false);
            }
        };
        loadVocabulary();
    }, [lang, isOpen]);

    const handleAddWordToFlashcards = (word) => {
        const studySets = getStudySets();
        if (studySets.length === 0) {
            alert("Please create a study set first.");
            return;
        }
        const firstSetId = studySets[0].id;
        const cardData = {
            term1: word.term,
            term2: word.definition,
            notes: word.example
        };
        addCardToSet(firstSetId, cardData);
        alert(`Word "${word.term}" added to study set "${studySets[0].name}".`);
    };

    const searchFunction = (item, searchTerm) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const termMatch = typeof item.term === 'string' && item.term.toLowerCase().includes(lowerSearchTerm);
        const definitionMatch = typeof item.definition === 'string' && item.definition.toLowerCase().includes(lowerSearchTerm);
        const exampleMatch = typeof item.example === 'string' && item.example.toLowerCase().includes(lowerSearchTerm);
        return termMatch || definitionMatch || exampleMatch;
    };

    const renderVocabularyCard = (item) => (
        <div key={item.id || item.term} className="vocabulary-item">
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
            {item.theme && <p className="vocab-theme"><small>{t('dictionary.theme', 'Theme:')} {item.theme}</small></p>}
            <button className="btn-icon" onClick={() => handleAddWordToFlashcards(item)}>➕</button>
        </div>
    );

    if (!isOpen) {
        return null;
    }

    if (isLoading) return <p>{t('dictionary.loading', 'Loading dictionary...')}</p>;
    if (error) return <p className="error-message">{t('dictionary.loadError', 'Error loading dictionary: ')}{error}</p>;

    return (
        <div className="tool-panel-modal">
            <div className="tool-panel-modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <h3>{t('dictionary.title', 'Vocabulary Dictionary')}</h3>
                <SearchableCardList
                    items={allVocabulary}
                    searchFunction={searchFunction}
                    renderCard={renderVocabularyCard}
                />
            </div>
        </div>
    );
};

export default DictionaryTool;
