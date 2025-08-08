import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { getStudySets } from '../../../utils/studySetService';
import FlashcardPlayer from '../FlashcardPlayer';
import MemoryGame from './MemoryGame';
import toast from 'react-hot-toast';
import './FlashcardsTool.css';

const FlashcardsTool = () => {
  const { t } = useI18n();
  const [studySets, setStudySets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [gameMode, setGameMode] = useState('flashcards');

  useEffect(() => {
    try {
      const sets = getStudySets();
      setStudySets(sets);
      if (sets.length > 0) {
        setSelectedSet(sets[0]);
      }
    } catch (error) {
      toast.error(t('flashcards.loadError', 'Could not load study sets.'));
      console.error("Error loading study sets from localStorage:", error);
    }
  }, [t]);

  const handleSetSelection = (event) => {
    const setId = event.target.value;
    const set = studySets.find(s => s.id === setId);
    setSelectedSet(set);
  };

  return (
    <div className="flashcards-tool">
      <h3>{t('studyMode.toolFlashcards', 'Flashcards')}</h3>
      {studySets.length > 0 ? (
        <>
          <div className="studyset-selector">
            <label htmlFor="studyset-select">{t('flashcards.selectSet', 'Select a study set:')}</label>
            <select id="studyset-select" onChange={handleSetSelection} value={selectedSet ? selectedSet.id : ''}>
              {studySets.map(set => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
            </select>
          </div>
          <div className="gamemode-selector">
            <label htmlFor="gamemode-select">{t('flashcards.selectGame', 'Select a game:')}</label>
            <select id="gamemode-select" onChange={(e) => setGameMode(e.target.value)} value={gameMode}>
              <option value="flashcards">Flashcards</option>
              <option value="memory">Memory Game</option>
            </select>
          </div>
          {selectedSet && selectedSet.items && selectedSet.items.length > 0 ? (
            gameMode === 'flashcards' ? (
              <FlashcardPlayer
                studySetId={selectedSet.id}
                initialSetData={selectedSet}
                source="student"
              />
            ) : (
              <MemoryGame studySet={selectedSet} />
            )
          ) : (
            <p className="no-cards-message">{t('flashcards.noCardsInSet', 'This study set is empty.')}</p>
          )}
        </>
      ) : (
        <p className="no-cards-message">{t('studyMode.noFlashcards', 'No flashcards available. Create some in the Dictionary tool!')}</p>
      )}
    </div>
  );
};

export default FlashcardsTool;
