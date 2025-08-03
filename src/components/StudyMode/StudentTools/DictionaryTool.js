import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { getStudySets, addCardToSet } from '../../../utils/studySetService';
// import { loadAllLevelsForLanguageAsFlatList } from '../../../utils/vocabularyService';
import SearchableCardList from '../../Common/SearchableCardList';
import FlashcardPlayer from '../FlashcardPlayer';
import Modal from '../../Common/Modal';
import toast from 'react-hot-toast';
import './DictionaryTool.css';

const DictionaryTool = ({ isOpen, onClose }) => {
    const { t, language, currentLangKey } = useI18n();
    const [allVocabulary] = useState([]);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const [showFlashcardPlayer, setShowFlashcardPlayer] = useState(false);

    useEffect(() => {
        const loadVocabulary = async () => {
            if (!language || !isOpen) return;
            // setIsLoading(true);
            // try {
            //     // const vocabularyData = await loadAllLevelsForLanguageAsFlatList(language);
            //     // setAllVocabulary(vocabularyData || []);
            // } catch (err) {
            //     setError(err.message || 'Failed to load vocabulary data.');
            // } finally {
            //     setIsLoading(false);
            // }
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
            term2: word.definition,
            notes: word.example
        };
        addCardToSet(firstSetId, cardData);
        toast.success(`'${word.term}' added to flashcards!`);
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
            <button className="btn btn-primary" onClick={() => handleAddWordToFlashcards(item)}>
                {t('dictionary.add_to_flashcards', 'Add to Flashcards')}
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
            <button onClick={() => setShowFlashcardPlayer(true)} className="btn btn-primary">
                {t('dictionary.study_flashcards', 'Study Flashcards')}
            </button>
            <SearchableCardList
                items={allVocabulary}
                searchFunction={searchFunction}
                renderCard={renderVocabularyCard}
            />
        </Modal>
    );
};

export default DictionaryTool;
