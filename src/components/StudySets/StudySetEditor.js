import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Commented out for now to simplify testing
import { getStudySetById, saveStudySet } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import './StudySetEditor.css';

// Added props: setIdProp (for explicit ID passing), onSetSaved, onCancel
const StudySetEditor = ({ setIdProp, onSetSaved, onCancel }) => {
  const { t, language: currentLangKey } = useI18n();
  // const { setId: paramSetId } = useParams(); // Commented out
  // const navigate = useNavigate(); // Commented out

  const actualSetId = setIdProp; // Prioritize prop for ID
  const isEditMode = Boolean(actualSetId);

  const [setName, setSetName] = useState('');
  const [description, setDescription] = useState('');
  const [languageCode, setLanguageCode] = useState(currentLangKey || 'COSYenglish');
  const [originalSetData, setOriginalSetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Reset for create mode
      setSetName('');
      setDescription('');
      setLanguageCode(currentLangKey || 'COSYenglish');
      setOriginalSetData(null);
      setIsLoading(false); // Ensure loading is false for create mode
      setError(null);      // Ensure error is clear for create mode
    }
  }, [actualSetId, isEditMode, t, currentLangKey]);

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
          onSetSaved(savedSet.id); // Pass back the ID of saved/created set
        } else {
          // Fallback alert if no callback provided
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Fallback alert if no callback provided
      alert(t('studySetEditor.cancelled', 'Operation cancelled.'));
      console.log("Cancelled editing/creating study set.");
    }
  };

  if (isLoading && isEditMode) { // Only show loading if in edit mode and actively fetching
    return <p>{t('loading', 'Loading set details...')}</p>;
  }
  if (error) {
    return <p className="error-message">{error}</p>;
  }
  // If in edit mode, but originalSetData is null (and not loading), it means set wasn't found.
  if (isEditMode && !originalSetData && !isLoading) {
    // Error should have been set by useEffect, so this might not be strictly needed if error displays.
    // However, if setError was missed, this is a fallback.
    return <p className="error-message">{t('studySetEditor.errorNotFound', 'Study set not found.')}</p>;
  }


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
          {/* TODO: Replace with a dropdown of supported languages from I18nContext or a config */}
          <input
            type="text"
            id="languageCode"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            placeholder="e.g., COSYfrench, COSYenglish"
            list="language-codes-datalist"
            disabled={isLoading}
          />
          {/* Example datalist - ideally this would be populated from i18n keys */}
          <datalist id="language-codes-datalist">
            <option value="COSYenglish" />
            <option value="COSYfrench" />
            <option value="COSYespañol" />
            {/* Add other known COSY language codes */}
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
