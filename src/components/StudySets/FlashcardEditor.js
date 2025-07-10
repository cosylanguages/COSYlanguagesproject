import React, { useState, useEffect, useCallback } from 'react';
import { getStudySetById, addCardToSet, updateCardInSet, deleteCardFromSet } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import './FlashcardEditor.css'; // To be created

const FlashcardEditor = ({ setId }) => {
  const { t } = useI18n();
  const [studySet, setStudySet] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding/editing a card
  const [isEditingCard, setIsEditingCard] = useState(false); // true if editing, false if adding new
  const [currentCard, setCurrentCard] = useState(null); // Card object being edited, or null for new

  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');
  const [imageURI, setImageURI] = useState('');
  const [audioURI, setAudioURI] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [notes, setNotes] = useState('');

  const loadSetDetails = useCallback(() => {
    if (!setId) {
      setError(t('flashcardEditor.noSetId', 'No study set ID provided.'));
      setIsLoading(false);
      setStudySet(null);
      setCards([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const set = getStudySetById(setId);
      if (set) {
        setStudySet(set);
        setCards(set.items || []);
      } else {
        setError(t('flashcardEditor.setNotFound', 'Study set not found.'));
        setStudySet(null);
        setCards([]);
      }
    } catch (err) {
      console.error("Error loading study set for card editing:", err);
      setError(t('flashcardEditor.loadError', 'Failed to load study set.'));
    } finally {
      setIsLoading(false);
    }
  }, [setId, t]);

  useEffect(() => {
    loadSetDetails();
  }, [loadSetDetails]);

  const resetForm = () => {
    setTerm1('');
    setTerm2('');
    setImageURI('');
    setAudioURI('');
    setExampleSentence('');
    setNotes('');
    setCurrentCard(null);
    setIsEditingCard(false);
  };

  const handleEditCard = (card) => {
    setIsEditingCard(true);
    setCurrentCard(card);
    setTerm1(card.term1);
    setTerm2(card.term2);
    setImageURI(card.imageURI || '');
    setAudioURI(card.audioURI || '');
    setExampleSentence(card.exampleSentence || '');
    setNotes(card.notes || '');
  };

  const handleDeleteCard = (cardId) => {
    const cardToDelete = cards.find(c => c.id === cardId);
    const confirmDelete = window.confirm(
      t('flashcardEditor.confirmDeleteCard', `Are you sure you want to delete the card "{term1}"?`, { term1: cardToDelete?.term1 || 'this card' })
    );
    if (confirmDelete) {
      try {
        const updatedSet = deleteCardFromSet(setId, cardId);
        if (updatedSet) {
          setCards(updatedSet.items);
          alert(t('flashcardEditor.deleteCardSuccess', 'Card deleted successfully.'));
        } else {
          // Error already logged by service, or card wasn't found
          alert(t('flashcardEditor.deleteCardError', 'Could not delete card.'));
        }
      } catch (err) {
        console.error("Error deleting card:", err);
        alert(t('flashcardEditor.deleteCardError', 'An error occurred while deleting the card.'));
      }
    }
  };

  const handleSubmitCard = (e) => {
    e.preventDefault();
    if (!term1.trim() || !term2.trim()) {
      alert(t('flashcardEditor.errorTermsRequired', 'Term 1 and Term 2 are required.'));
      return;
    }

    const cardData = {
      term1: term1.trim(),
      term2: term2.trim(),
      imageURI: imageURI.trim(),
      audioURI: audioURI.trim(),
      exampleSentence: exampleSentence.trim(),
      notes: notes.trim(),
      // srsData will be handled by service if new, or preserved if editing (unless explicitly changed)
    };

    try {
      let updatedSet;
      if (isEditingCard && currentCard) {
        updatedSet = updateCardInSet(setId, currentCard.id, cardData);
        alert(t('flashcardEditor.updateCardSuccess', 'Card updated successfully.'));
      } else {
        updatedSet = addCardToSet(setId, cardData);
        alert(t('flashcardEditor.addCardSuccess', 'Card added successfully.'));
      }

      if (updatedSet) {
        setCards(updatedSet.items);
        resetForm();
      } else {
        throw new Error(t('flashcardEditor.errorSavingCard', 'Failed to save card.'));
      }
    } catch (err) {
      console.error("Error saving card:", err);
      alert(err.message || t('flashcardEditor.errorSavingCard', 'An error occurred while saving the card.'));
    }
  };

  if (isLoading) {
    return <p>{t('loading', 'Loading card editor...')}</p>;
  }
  if (error) {
    return <p className="error-message">{error}</p>;
  }
  if (!studySet) {
    return <p>{t('flashcardEditor.selectSetPrompt', 'Select a study set to manage its cards.')}</p>;
  }

  return (
    <div className="flashcard-editor-container">
      <h3>{t('flashcardEditor.editingTitle', `Editing Cards for: ${studySet.name}`)}</h3>

      <form onSubmit={handleSubmitCard} className="card-form">
        <h4>{isEditingCard ? t('flashcardEditor.formTitleEdit', 'Edit Card') : t('flashcardEditor.formTitleAdd', 'Add New Card')}</h4>
        <div className="form-group">
          <label htmlFor="term1">{t('flashcardEditor.term1Label', 'Term 1 (e.g., Word/Phrase):')}</label>
          <input type="text" id="term1" value={term1} onChange={(e) => setTerm1(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="term2">{t('flashcardEditor.term2Label', 'Term 2 (e.g., Translation/Definition):')}</label>
          <input type="text" id="term2" value={term2} onChange={(e) => setTerm2(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="imageURI">{t('flashcardEditor.imageURILabel', 'Image URL (Optional):')}</label>
          <input type="text" id="imageURI" value={imageURI} onChange={(e) => setImageURI(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="audioURI">{t('flashcardEditor.audioURILabel', 'Audio URL (Optional):')}</label>
          <input type="text" id="audioURI" value={audioURI} onChange={(e) => setAudioURI(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="exampleSentence">{t('flashcardEditor.exampleSentenceLabel', 'Example Sentence (Optional):')}</label>
          <textarea id="exampleSentence" value={exampleSentence} onChange={(e) => setExampleSentence(e.target.value)} rows="2"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="notes">{t('flashcardEditor.notesLabel', 'Notes (Optional):')}</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="2"></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditingCard ? t('flashcardEditor.saveCardButton', 'Save Card') : t('flashcardEditor.addCardButton', 'Add Card')}
          </button>
          {isEditingCard && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              {t('flashcardEditor.cancelEditButton', 'Cancel Edit')}
            </button>
          )}
        </div>
      </form>

      <hr />
      <h4>{t('flashcardEditor.cardsListTitle', 'Cards in this Set')} ({cards.length})</h4>
      {cards.length === 0 ? (
        <p>{t('flashcardEditor.noCardsYet', 'No cards in this set yet. Add one above!')}</p>
      ) : (
        <ul className="flashcard-list">
          {cards.map(card => (
            <li key={card.id} className="flashcard-item">
              <div className="card-terms">
                <p><strong>{t('flashcardEditor.term1Display', 'Term 1:')}</strong> {card.term1}</p>
                <p><strong>{t('flashcardEditor.term2Display', 'Term 2:')}</strong> {card.term2}</p>
                {card.exampleSentence && <p><small><em>{t('flashcardEditor.exampleDisplay', 'Ex:')} {card.exampleSentence}</em></small></p>}
              </div>
              <div className="card-actions">
                <button onClick={() => handleEditCard(card)} className="btn btn-secondary btn-sm">
                  {t('editButton', 'Edit')}
                </button>
                <button onClick={() => handleDeleteCard(card.id)} className="btn btn-danger btn-sm">
                  {t('deleteButton', 'Delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlashcardEditor;
