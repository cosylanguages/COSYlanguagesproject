// Import necessary libraries and components.
import React, { useState, useEffect, useCallback } from 'react';
import { getStudySets, deleteStudySet } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import './StudySetList.css';

/**
 * A component that displays a list of study sets.
 * It provides options to create, edit, delete, and study sets.
 * @param {object} props - The component's props.
 * @param {function} props.onCreateNew - A callback function to handle the creation of a new study set.
 * @param {function} props.onEditSetDetails - A callback function to handle the editing of a study set's details.
 * @param {function} props.onEditSetCards - A callback function to handle the editing of a study set's cards.
 * @param {function} props.onLaunchStudyPlayer - A callback function to handle the launching of the study player.
 * @returns {JSX.Element} The StudySetList component.
 */
const StudySetList = ({ onCreateNew, onEditSetDetails, onEditSetCards, onLaunchStudyPlayer }) => {
  const { t } = useI18n();
  // State for the list of study sets, loading status, and errors.
  const [studySets, setStudySets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads the list of study sets from the study set service.
   */
  const loadSets = useCallback(() => {
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
  }, [t]);

  // Load the study sets when the component mounts.
  useEffect(() => {
    loadSets();
  }, [loadSets]);

  /**
   * Handles the creation of a new study set.
   */
  const handleCreateNew = () => {
    if (onCreateNew) onCreateNew();
    else console.log("Create new set (handler not provided)");
  };

  /**
   * Handles the studying of a study set.
   * @param {string} setId - The ID of the study set to study.
   */
  const handleStudySet = (setId) => {
    if (onLaunchStudyPlayer) {
      onLaunchStudyPlayer(setId);
    } else {
      console.log(`Study set with ID: ${setId} (handler not provided)`);
      alert(t('studySets.studySetFunctionality', 'Study functionality coming soon!'));
    }
  };

  /**
   * Handles the editing of a study set.
   * @param {string} setId - The ID of the study set to edit.
   */
  const handleEditSet = (setId) => {
    if (onEditSetDetails) onEditSetDetails(setId);
    else console.log(`Edit set details (handler not provided) for ID: ${setId}`);
  };

  /**
   * Handles the deletion of a study set.
   * @param {string} setId - The ID of the study set to delete.
   * @param {string} setName - The name of the study set to delete.
   */
  const handleDeleteSet = (setId, setName) => {
    const confirmDelete = window.confirm(
      t('studySets.confirmDelete', `Are you sure you want to delete the study set "${setName}"? This action cannot be undone.`, { setName })
    );
    if (confirmDelete) {
      try {
        const success = deleteStudySet(setId);
        if (success) {
          loadSets();
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

  // If the component is loading, display a loading message.
  if (isLoading) {
    return <p>{t('loading', 'Loading study sets...')}</p>;
  }

  // If there is an error, display an error message.
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Render the study set list.
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
