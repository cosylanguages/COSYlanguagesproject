import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import StudySetList from '../../components/StudySets/StudySetList';
import StudySetEditor from '../../components/StudySets/StudySetEditor';
import FlashcardEditor from '../../components/StudySets/FlashcardEditor';
import { useI18n } from '../../i18n/I18nContext';
import './MyStudySetsPage.css'; // To be created

const MyStudySetsPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  // This page will manage different views: list, edit-set, edit-cards
  // We can use local state or URL params to manage the view.
  // For simplicity with current setup, let's use local state.
  // A more robust solution might use nested routes.

  const [currentView, setCurrentView] = useState('list'); // 'list', 'editSet', 'editCards'
  const [selectedSetId, setSelectedSetId] = useState(null); // For editing an existing set or its cards
  const [isCreatingNewSet, setIsCreatingNewSet] = useState(false);

  // --- Navigation/View Handlers ---
  const showListView = () => {
    setCurrentView('list');
    setSelectedSetId(null);
    setIsCreatingNewSet(false);
    // Consider if navigate('/') or navigate('/my-sets') is needed to clear URL params if used
  };

  const handleCreateNewSet = () => {
    setSelectedSetId(null); // Clear any selected set ID
    setIsCreatingNewSet(true);
    setCurrentView('editSet');
    // navigate('/my-sets/new'); // If using routing
  };

  const handleEditSetDetails = (setId) => {
    setSelectedSetId(setId);
    setIsCreatingNewSet(false);
    setCurrentView('editSet');
    // navigate(`/my-sets/${setId}/edit-details`); // If using routing
  };

  const handleEditSetCards = (setId) => {
    setSelectedSetId(setId);
    setIsCreatingNewSet(false); // Should already be false if coming from editing details
    setCurrentView('editCards');
    // navigate(`/my-sets/${setId}/edit-cards`); // If using routing
  };

  // --- Callbacks from Editors ---
  const onSetSaved = (savedSetId) => {
    // After saving set details (new or edit), proceed to card editor for that set
    handleEditSetCards(savedSetId);
  };

  const onSetEditorCancelled = () => {
    showListView();
  };

  const onCardEditorFinished = () => {
    // After finishing card editing, could go to set details or back to list.
    // For now, back to list.
    showListView();
  };


  // Render logic based on currentView
  let content;
  if (currentView === 'editSet') {
    content = (
      <StudySetEditor
        key={selectedSetId || 'new'} // Ensure re-render if selectedSetId changes
        setIdProp={selectedSetId} // Pass explicitly to avoid confusion with useParams if nested routing was used
        onSetSaved={onSetSaved}
        onCancel={onSetEditorCancelled}
      />
    );
  } else if (currentView === 'editCards' && selectedSetId) {
    content = (
      <FlashcardEditor
        setId={selectedSetId}
        onFinished={onCardEditorFinished} // Prop to signal completion
      />
    );
  } else { // Default to 'list' view
    content = (
      <StudySetList
        onCreateNew={handleCreateNewSet}
        onEditSetDetails={handleEditSetDetails} // Pass handler to edit set details
        onEditSetCards={handleEditSetCards}   // Pass handler to edit cards of a set
        // onStudySet will be handled by StudySetList for now (placeholder alert)
      />
    );
  }

  return (
    <div className="my-study-sets-page">
      <h1>{t('myStudySetsPage.title', 'Manage Your Study Sets')}</h1>
      {currentView !== 'list' && (
        <button onClick={showListView} className="btn btn-secondary back-to-list-btn">
          {t('myStudySetsPage.backToList', '← Back to Set List')}
        </button>
      )}
      {content}
    </div>
  );
};

export default MyStudySetsPage;
