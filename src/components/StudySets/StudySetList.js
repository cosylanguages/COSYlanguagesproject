import React, { useState, useEffect } from 'react';
import { getStudySets, deleteStudySet } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom'; // For navigation
import './StudySetList.css';

// Added props: onCreateNew, onEditSetDetails, onEditSetCards
const StudySetList = ({ onCreateNew, onEditSetDetails, onEditSetCards }) => {
  const { t, language: currentUILanguage } = useI18n();
  const [studySets, setStudySets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Not used directly if parent handles navigation

  const loadSets = () => {
    setIsLoading(true);
    setError(null);
    try {
      const sets = getStudySets();
      setStudySets(sets);
    } catch (err) {
      console.error("Error loading study sets:", err);
      setError(t('studySets.loadError', 'Failed to load study sets.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, [t]); // Reload if language changes for t function, though sets are not language-specific from service

  const handleCreateNew = () => {
    if (onCreateNew) onCreateNew();
    else console.log("Create new set (handler not provided)");
  };

  const handleStudySet = (setId) => {
    // TODO: This will likely involve navigation or calling a prop from parent to launch player
    console.log(`Study set with ID: ${setId}`);
    alert(t('studySets.studySetFunctionality', 'Study functionality coming soon!'));
  };

  const handleEditSet = (setId) => {
    // This could navigate to a page that shows StudySetEditor then FlashcardEditor,
    // or directly to FlashcardEditor if details are simple or combined.
    // For now, assume MyStudySetsPage handles showing the correct editor.
    // The parent page (MyStudySetsPage) will decide whether to show StudySetEditor or FlashcardEditor first.
    // Let's assume onEditSetDetails is for the metadata, and onEditSetCards is separate.
    // Or, have a single onEdit that takes to a combined edit experience.
    // For simplicity, let's have two distinct edit actions from the list for now.
    if (onEditSetDetails) onEditSetDetails(setId); // To edit name, description etc.
    // If you want a single "Edit" that leads to card editing directly or via details:
    // if (onEditSetCards) onEditSetCards(setId);
    else console.log(`Edit set details (handler not provided) for ID: ${setId}`);
  };

  const handleDeleteSet = (setId, setName) => {
    const confirmDelete = window.confirm(
      t('studySets.confirmDelete', `Are you sure you want to delete the study set "${setName}"? This action cannot be undone.`, { setName })
    );
    if (confirmDelete) {
      try {
        const success = deleteStudySet(setId);
        if (success) {
          loadSets(); // Refresh the list
          alert(t('studySets.deleteSuccess', `Study set "${setName}" deleted successfully.`, { setName }));
        } else {
          alert(t('studySets.deleteErrorNotFound', `Could not delete "${setName}". Set not found.`, { setName }));
          setError(t('studySets.deleteErrorNotFound', `Could not delete "${setName}". Set not found.`, { setName }));
        }
      } catch (err) {
        console.error("Error deleting study set:", err);
        alert(t('studySets.deleteErrorGeneric', `An error occurred while deleting "${setName}".`, { setName }));
        setError(t('studySets.deleteErrorGeneric', `An error occurred while deleting "${setName}".`, { setName }));
      }
    }
  };

  if (isLoading) {
    return <p>{t('loading', 'Loading study sets...')}</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="study-set-list-container">
      <div className="study-set-list-header">
        <h2>{t('studySets.myTitle', 'My Study Sets')}</h2>
        <button onClick={handleCreateNew} className="btn btn-primary">
          {t('studySets.createNewSet', 'Create New Set')}
        </button>
      </div>

      {studySets.length === 0 ? (
        <p>{t('studySets.noSetsFound', 'No study sets found. Create one to get started!')}</p>
      ) : (
        <ul className="study-set-list">
          {studySets.map((set) => (
            <li key={set.id} className="study-set-item">
              <div className="set-info">
                <h3>{set.name}</h3>
                <p>
                  {t('studySets.itemsCount', `{count, plural, =0 {No items} one {# item} other {# items}}`, { count: set.items?.length || 0 })}
                  {set.languageCode && ` (${t('studySets.language', 'Lang')}: ${set.languageCode.replace('COSY', '')})`}
                </p>
                {set.description && <p className="set-description">{set.description}</p>}
              </div>
              <div className="set-actions">
                <button onClick={() => handleStudySet(set.id)} className="btn btn-secondary btn-sm">
                  {t('studySets.studyButton', 'Study')}
                </button>
                <button onClick={() => handleEditSet(set.id)} className="btn btn-secondary btn-sm">
                  {t('studySets.editButton', 'Edit')}
                </button>
                <button onClick={() => handleDeleteSet(set.id, set.name)} className="btn btn-danger btn-sm">
                  {t('studySets.deleteButton', 'Delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudySetList;
