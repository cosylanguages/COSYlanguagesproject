// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import { getStudySetById, saveStudySet } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import './StudySetEditor.css';

/**
 * A component for creating and editing study sets.
 * @param {object} props - The component's props.
 * @param {string} props.setIdProp - The ID of the study set to edit.
 * @param {function} props.onSetSaved - A callback function to handle the saving of a study set.
 * @param {function} props.onCancel - A callback function to handle the cancellation of the editing process.
 * @returns {JSX.Element} The StudySetEditor component.
 */
const StudySetEditor = ({ setIdProp, onSetSaved, onCancel }) => {
  const { t, language: currentLangKey } = useI18n();
  const actualSetId = setIdProp;
  const isEditMode = Boolean(actualSetId);

  // State for the form fields, loading status, and errors.
  const [setName, setSetName] = useState('');
  const [description, setDescription] = useState('');
  const [languageCode, setLanguageCode] = useState(currentLangKey || 'COSYenglish');
  const [originalSetData, setOriginalSetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to load the study set data when in edit mode.
  useEffect(() => {
    if (isEditMode && actualSetId) {
      setIsLoading(true);
      try {
        const set = getStudySetById(actualSetId);
        if (set) {
          setOriginalSetData(set);
          setSetName(set.name || '');
          setDescription(set.description || '');
          setLanguageCode(set.languageCode || currentLangKey || 'COSYenglish');
        } else {
          setError(t('studySetEditor.errorNotFound', 'Study set not found.'));
        }
      } catch (err) {
        console.error("Error loading study set for editing:", err);
        setError(t('studySetEditor.loadError', 'Failed to load study set for editing.'));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Reset the form for create mode.
      setSetName('');
      setDescription('');
      setLanguageCode(currentLangKey || 'COSYenglish');
      setOriginalSetData(null);
      setIsLoading(false);
      setError(null);
    }
  }, [actualSetId, isEditMode, t, currentLangKey]);

  /**
   * Handles the submission of the form.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!setName.trim()) {
      setError(t('studySetEditor.errorNameRequired', 'Set name is required.'));
      return;
    }
    setError(null);
    setIsLoading(true);

    const studySetDataToSave = {
      id: isEditMode ? actualSetId : undefined,
      name: setName.trim(),
      description: description.trim(),
      languageCode: languageCode,
      items: isEditMode && originalSetData ? originalSetData.items : [],
      createdAt: isEditMode && originalSetData ? originalSetData.createdAt : undefined,
    };

    try {
      const savedSet = saveStudySet(studySetDataToSave);
      if (savedSet) {
        if (onSetSaved) {
          onSetSaved(savedSet.id);
        } else {
          alert(t('studySetEditor.saveSuccess', `Study set "${savedSet.name}" saved successfully!`));
        }
      } else {
        throw new Error(t('studySetEditor.errorSaveGeneric', 'Failed to save study set.'));
      }
    } catch (err) {
      console.error("Error saving study set:", err);
      setError(err.message || t('studySetEditor.errorSaveGeneric', 'Failed to save study set.'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the cancellation of the editing process.
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      alert(t('studySetEditor.cancelled', 'Operation cancelled.'));
      console.log("Cancelled editing/creating study set.");
    }
  };

  // If the component is loading, display a loading message.
  if (isLoading && isEditMode) {
    return <p>{t('loading', 'Loading set details...')}</p>;
  }
  // If there is an error, display an error message.
  if (error) {
    return <p className="error-message">{error}</p>;
  }
  // If the study set is not found, display an error message.
  if (isEditMode && !originalSetData && !isLoading) {
    return <p className="error-message">{t('studySetEditor.errorNotFound', 'Study set not found.')}</p>;
  }

  // Render the study set editor form.
  return (
    <div className="study-set-editor-container">
      <h2>{isEditMode ? t('studySetEditor.titleEdit', 'Edit Study Set') : t('studySetEditor.titleCreate', 'Create New Study Set')}</h2>
      <form onSubmit={handleSubmit} className="study-set-form">
        <div className="form-group">
          <label htmlFor="setName">{t('studySetEditor.nameLabel', 'Set Name:')}</label>
          <input
            type="text"
            id="setName"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder={t('studySetEditor.namePlaceholder', 'e.g., French Vocabulary Chapter 1')}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">{t('studySetEditor.descriptionLabel', 'Description (Optional):')}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('studySetEditor.descriptionPlaceholder', 'A brief description of this set')}
            rows="3"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="languageCode">{t('studySetEditor.languageCodeLabel', 'Language Code:')}</label>
          <input
            type="text"
            id="languageCode"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            placeholder="e.g., COSYfrench, COSYenglish"
            list="language-codes-datalist"
            disabled={isLoading}
          />
          <datalist id="language-codes-datalist">
            <option value="COSYenglish" />
            <option value="COSYfrench" />
            <option value="COSYespañol" />
          </datalist>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? t('saving', 'Saving...') : (isEditMode ? t('studySetEditor.saveChangesButton', 'Save Changes') : t('studySetEditor.createSetButton', 'Create Set'))}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isLoading}>
            {t('cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudySetEditor;
