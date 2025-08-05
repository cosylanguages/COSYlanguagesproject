import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { getStudySets, addCardToSet } from '../../../utils/studySetService';
import { loadAllLevelsForLanguageAsFlatList } from '../../../utils/vocabularyService';
import { dictionaryLinks } from '../../../config/dictionaryLinks';
import SearchableCardList from '../../Common/SearchableCardList';
import FlashcardPlayer from '../FlashcardPlayer';
import Modal from '../../Common/Modal';
import toast from 'react-hot-toast';
import './DictionaryTool.css';

const DictionaryTool = ({ isOpen, onClose }) => {
    const { t, language, currentLangKey } = useI18n();
    const [allVocabulary, setAllVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFlashcardPlayer, setShowFlashcardPlayer] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [currentView, setCurrentView] = useState('vocabulary'); // vocabulary, history, favorites

    useEffect(() => {
        const storedFavorites = localStorage.getItem(`favorites_${currentLangKey}`);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, [currentLangKey]);

    useEffect(() => {
        const storedHistory = localStorage.getItem(`searchHistory_${currentLangKey}`);
        if (storedHistory) {
            setSearchHistory(JSON.parse(storedHistory));
        }
    }, [currentLangKey]);

    useEffect(() => {
        const loadVocabulary = async () => {
            if (!language || !isOpen) return;
            setIsLoading(true);
            try {
                const vocabularyData = await loadAllLevelsForLanguageAsFlatList(language);
                setAllVocabulary(vocabularyData || []);
            } catch (err) {
                setError(err.message || 'Failed to load vocabulary data.');
            } finally {
                setIsLoading(false);
            }
        };
        loadVocabulary();
    }, [language, isOpen]);

    const handleAddWordToFlashcards = (word) => {
        const studySets = getStudySets();
        if (studySets.length === 0) {
            const newSet = {
                id: `set_${Date.now()}`,
                name: "My Study Set",
                items: [],
            };
            localStorage.setItem("cosyStudySets", JSON.stringify([newSet]));
        }
        const firstSetId = getStudySets()[0].id;
        const cardData = {
            term1: word.term,
            term2: word.definition || word.term,
            notes: word.example || ''
        };
        addCardToSet(firstSetId, cardData);
        toast.success(`'${word.term}' added to flashcards!`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm && currentLangKey) {
            const baseUrl = dictionaryLinks[currentLangKey];
            if (baseUrl) {
                const url = `${baseUrl}${encodeURIComponent(trimmedSearchTerm)}`;
                window.open(url, '_blank', 'noopener,noreferrer');

                const newHistory = [trimmedSearchTerm, ...searchHistory.filter(item => item !== trimmedSearchTerm)].slice(0, 10);
                setSearchHistory(newHistory);
                localStorage.setItem(`searchHistory_${currentLangKey}`, JSON.stringify(newHistory));
            }
        }
    };

    const handleClearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem(`searchHistory_${currentLangKey}`);
    };

    const toggleFavorite = (word) => {
        const isFavorite = favorites.some(fav => fav.term === word.term);
        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter(fav => fav.term !== word.term);
        } else {
            newFavorites = [...favorites, word];
        }
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${currentLangKey}`, JSON.stringify(newFavorites));
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
                {item.term && <button onClick={() => pronounceText(item.term, item.lang || currentLangKey)} className="button--icon pronounce-btn-inline" title={t('dictionary.pronounceTerm', 'Pronounce term')}>🔊</button>}
            </h4>
            {item.pronunciation && <p className="vocab-pronunciation"><strong>{t('dictionary.pronunciation', 'Pronunciation:')}</strong> {item.pronunciation}</p>}
            {item.partOfSpeech && <p className="vocab-pos"><strong>{t('dictionary.partOfSpeech', 'Part of Speech:')}</strong> {item.partOfSpeech}</p>}
            {item.gender && <p className="vocab-gender"><strong>{t('dictionary.gender', 'Gender:')}</strong> {item.gender}</p>}
            {item.latinisation && <p className="vocab-latinisation"><strong>{t('dictionary.latinisation', 'Latinisation:')}</strong> {item.latinisation}</p>}
            {item.definition && <p className="vocab-definition"><strong>{t('dictionary.definition', 'Definition:')}</strong> {item.definition}</p>}
            {item.example && <p className="vocab-example"><strong>{t('dictionary.example', 'Example:')}</strong> <em>{item.example}</em></p>}
            {item.theme && <p className="vocab-theme"><small>{t('dictionary.theme', 'Theme:')} {item.theme}</small></p>}
            <button className="button" onClick={() => handleAddWordToFlashcards(item)}>
                {t('dictionary.add_to_flashcards', 'Add to Flashcards')}
            </button>
            <button className={`button--icon favorite-btn ${favorites.some(fav => fav.term === item.term) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(item)} title={t('dictionary.toggle_favorite', 'Toggle Favorite')}>
                ★
            </button>
        </div>
    );

    if (isLoading) return <p>{t('dictionary.loading', 'Loading dictionary...')}</p>;
    if (error) return <p className="error-message">{t('dictionary.loadError', 'Error loading dictionary: ')}{error}</p>;

    if (showFlashcardPlayer) {
        const studySets = getStudySets();
        const studySet = studySets.length > 0 ? studySets[0] : { items: [] };
        return (
            <Modal isOpen={showFlashcardPlayer} onClose={() => setShowFlashcardPlayer(false)} title={t('dictionary.study_flashcards', 'Study Flashcards')}>
                <FlashcardPlayer
                    studySetId={studySet.id}
                    initialSetData={studySet}
                    onExitPlayer={() => setShowFlashcardPlayer(false)}
                    source="student"
                />
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('dictionary.title', 'Vocabulary Dictionary')}>
            <div className="dictionary-controls">
                <div className="dictionary-view-selector">
                    <button onClick={() => setCurrentView('vocabulary')} className={`button ${currentView === 'vocabulary' ? 'active' : ''}`}>{t('dictionary.vocabulary', 'Vocabulary')}</button>
                    <button onClick={() => setCurrentView('history')} className={`button ${currentView === 'history' ? 'active' : ''}`}>{t('dictionary.history', 'History')}</button>
                    <button onClick={() => setCurrentView('favorites')} className={`button ${currentView === 'favorites' ? 'active' : ''}`}>{t('dictionary.favorites', 'Favorites')}</button>
                </div>
                <button onClick={() => setShowFlashcardPlayer(true)} className="button">
                    {t('dictionary.study_flashcards', 'Study Flashcards')}
                </button>
                <form onSubmit={handleSearch} className="dictionary-search-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('dictionary.search_placeholder', 'Look up a word...')}
                        className="dictionary-search-input"
                    />
                    <button type="submit" className="button">
                        {t('dictionary.search', 'Search')}
                    </button>
                </form>
            </div>

            {currentView === 'vocabulary' && (
                <SearchableCardList
                    items={allVocabulary}
                    searchFunction={searchFunction}
                    renderCard={renderVocabularyCard}
                />
            )}

            {currentView === 'history' && (
                <div className="search-history">
                    <h4>{t('dictionary.recent_searches', 'Recent Searches')}</h4>
                    {searchHistory.length > 0 ? (
                        <>
                            <ul>
                                {searchHistory.map((item, index) => (
                                    <li key={index} onClick={() => setSearchTerm(item)}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleClearHistory} className="button--link">
                                {t('dictionary.clear_history', 'Clear History')}
                            </button>
                        </>
                    ) : (
                        <p>{t('dictionary.no_history', 'No search history yet.')}</p>
                    )}
                </div>
            )}

            {currentView === 'favorites' && (
                <div className="favorites-list">
                    <h4>{t('dictionary.favorite_words', 'Favorite Words')}</h4>
                    {favorites.length > 0 ? (
                        <SearchableCardList
                            items={favorites}
                            searchFunction={searchFunction}
                            renderCard={renderVocabularyCard}
                        />
                    ) : (
                        <p>{t('dictionary.no_favorites', 'You have no favorite words yet.')}</p>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default DictionaryTool;
