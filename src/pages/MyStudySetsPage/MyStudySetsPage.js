import React, { useState } from 'react';
// Removed unused: useParams, useLocation. useNavigate might be used later for routing.
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
import StudySetList from '../../components/StudySets/StudySetList';
import StudySetEditor from '../../components/StudySets/StudySetEditor';
import FlashcardEditor from '../../components/StudySets/FlashcardEditor';
import FlashcardPlayer from '../../components/StudyMode/StudentTools/FlashcardPlayer'; // Import FlashcardPlayer
import { getStudySetById } from '../../utils/studySetService'; // To fetch set for player
import { useI18n } from '../../i18n/I18nContext';
import './MyStudySetsPage.css';

const MyStudySetsPage = () => {
  const { t } = useI18n();
  // const navigate = useNavigate(); // Keep for future routing if needed

  const [currentView, setCurrentView] = useState('list'); // 'list', 'editSet', 'editCards', 'studyPlayer'
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [setForPlayer, setSetForPlayer] = useState(null); // To hold the full set data for the player
  // const [isCreatingNewSet, setIsCreatingNewSet] = useState(false); // This state might be redundant if selectedSetId handles 'new'

  const showListView = () => {
    setCurrentView('list');
    setSelectedSetId(null);
    setSetForPlayer(null);
    // setIsCreatingNewSet(false);
  };

  const handleCreateNewSet = () => {
    setSelectedSetId(null);
    // setIsCreatingNewSet(true);
    setCurrentView('editSet');
  };

  const handleEditSetDetails = (setId) => {
    setSelectedSetId(setId);
    // setIsCreatingNewSet(false);
    setCurrentView('editSet');
  };

  const handleEditSetCards = (setId) => {
    setSelectedSetId(setId);
    // setIsCreatingNewSet(false);
    setCurrentView('editCards');
  };

  const handleLaunchStudyPlayer = (setId) => {
    const setToPlay = getStudySetById(setId);
    if (setToPlay) {
      setSelectedSetId(setId); // Keep track of which set is being studied
      setSetForPlayer(setToPlay);
      setCurrentView('studyPlayer');
    } else {
      alert(t('myStudySetsPage.errorSetNotFoundForPlayer', 'Could not find the set to study.'));
    }
  };

  const onSetSaved = (savedSetId) => {
    handleEditSetCards(savedSetId);
  };

  const onSetEditorCancelled = () => {
    showListView();
  };

  const onCardEditorFinished = () => {
    showListView();
  };

  const onPlayerExit = () => {
    showListView();
  };

  let content;
  if (currentView === 'editSet') {
    content = (
      <StudySetEditor
        key={selectedSetId || 'new-set-editor'}
        setIdProp={selectedSetId}
        onSetSaved={onSetSaved}
        onCancel={onSetEditorCancelled}
      />
    );
  } else if (currentView === 'editCards' && selectedSetId) {
    content = (
      <FlashcardEditor
        setId={selectedSetId}
        onFinished={onCardEditorFinished}
      />
    );
  } else if (currentView === 'studyPlayer' && setForPlayer) {
    content = (
      <FlashcardPlayer
        studySetId={setForPlayer.id} // Pass the ID
        initialSetData={setForPlayer} // Pass the full set data
        onExitPlayer={onPlayerExit}
        source="student" // Assuming these are student's personal sets from local storage
      />
    );
  }
  else {
    content = (
      <StudySetList
        onCreateNew={handleCreateNewSet}
        onEditSetDetails={handleEditSetDetails}
        onEditSetCards={handleEditSetCards}
        onLaunchStudyPlayer={handleLaunchStudyPlayer} // New prop
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
