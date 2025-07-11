import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import StudySetList from '../../components/StudySets/StudySetList';
import StudySetEditor from '../../components/StudySets/StudySetEditor';
import FlashcardEditor from '../../components/StudySets/FlashcardEditor';
import FlashcardPlayer from '../../components/StudyMode/StudentTools/FlashcardPlayer';
import { getStudySetById } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import './MyStudySetsPage.css';

const MyStudySetsPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation(); // To determine current view based on path
  const params = useParams();     // To get :setId if present

  // Determine current view and selectedSetId from URL (or props if not using full nested routes yet)
  // This logic will become simpler when full nested routing renders components directly.
  // For now, we simulate view switching based on path, preparing for Outlet.

  let currentView = 'list';
  let viewSetId = params.setId || null; // If :setId is in the path

  if (location.pathname.endsWith('/new')) {
    currentView = 'editSet';
    viewSetId = null; // Explicitly null for new
  } else if (location.pathname.includes('/edit')) { // Covers /:setId/edit
    currentView = 'editSet';
  } else if (location.pathname.includes('/cards')) { // Covers /:setId/cards
    currentView = 'editCards';
  } else if (location.pathname.includes('/study')) { // Covers /:setId/study
    currentView = 'studyPlayer';
  }

  const [selectedSetIdForPlayer, setSelectedSetIdForPlayer] = useState(null);
  const [setForPlayer, setSetForPlayer] = useState(null);

  // Effect to load data for player when viewSetId and currentView indicate studyPlayer
  useEffect(() => {
    if (currentView === 'studyPlayer' && viewSetId) {
      const setToPlay = getStudySetById(viewSetId);
      if (setToPlay) {
        setSetForPlayer(setToPlay);
        setSelectedSetIdForPlayer(viewSetId);
      } else {
        alert(t('myStudySetsPage.errorSetNotFoundForPlayer', 'Could not find the set to study.'));
        navigate('/my-sets'); // Go back to list if set not found
      }
    } else {
      setSetForPlayer(null); // Clear if not in studyPlayer view
      setSelectedSetIdForPlayer(null);
    }
  }, [currentView, viewSetId, navigate, t]);


  // --- Navigation Handlers ---
  const showListView = () => navigate('/my-sets');
  const handleCreateNewSet = () => navigate('/my-sets/new');
  const handleEditSetDetails = (setId) => navigate(`/my-sets/${setId}/edit`);
  const handleEditSetCards = (setId) => navigate(`/my-sets/${setId}/cards`);
  const handleLaunchStudyPlayer = (setId) => navigate(`/my-sets/${setId}/study`);

  // --- Callbacks from Editors ---
  const onSetSaved = (savedSetId) => {
    // After saving set details (new or edit), proceed to card editor for that set
    handleEditSetCards(savedSetId);
  };
  const onSetEditorCancelled = () => showListView();
  const onCardEditorFinished = () => showListView(); // Or navigate to set details: handleEditSetDetails(viewSetId)
  const onPlayerExit = () => showListView();


  let content;
  if (currentView === 'editSet') {
    content = (
      <StudySetEditor
        key={viewSetId || 'new-set-editor'}
        setIdProp={viewSetId} // Use viewSetId derived from URL/path
        onSetSaved={onSetSaved}
        onCancel={onSetEditorCancelled}
      />
    );
  } else if (currentView === 'editCards' && viewSetId) {
    content = (
      <FlashcardEditor
        setId={viewSetId}
        onFinished={onCardEditorFinished}
      />
    );
  } else if (currentView === 'studyPlayer' && setForPlayer) {
    content = (
      <FlashcardPlayer
        studySetId={selectedSetIdForPlayer}
        initialSetData={setForPlayer}
        onExitPlayer={onPlayerExit}
        source="student"
      />
    );
  }
  else { // Default to 'list' view, or if path is just /my-sets
    content = (
      <StudySetList
        onCreateNew={handleCreateNewSet}
        onEditSetDetails={handleEditSetDetails}
        onEditSetCards={handleEditSetCards}
        onLaunchStudyPlayer={handleLaunchStudyPlayer}
      />
    );
  }

  return (
    <div className="my-study-sets-page">
      <h1>{t('myStudySetsPage.title', 'Manage Your Study Sets')}</h1>
      {/* This button might be redundant if using browser back button with proper routing */}
      {currentView !== 'list' && (
        <button onClick={showListView} className="btn btn-secondary back-to-list-btn">
          {t('myStudySetsPage.backToList', '← Back to Set List')}
        </button>
      )}
      {/* If fully using nested routes, <Outlet /> would go here instead of {content} */}
      {content}
    </div>
  );
};

export default MyStudySetsPage;
