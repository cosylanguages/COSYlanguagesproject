import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import StudySetList from '../../components/StudySets/StudySetList';
import StudySetEditor from '../../components/StudySets/StudySetEditor';
import FlashcardEditor from '../../components/StudySets/FlashcardEditor';
import FlashcardPlayer from '../../components/StudyMode/StudentTools/FlashcardPlayer';
import { getStudySetById } from '../../utils/studySetService';
import { useI18n } from '../../i18n/I18nContext';
import { useStudySet } from '../../contexts/StudySetContext';
import './MyStudySetsPage.css';

const MyStudySetsPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { selectedSetId, setSelectedSetId, currentView, setCurrentView } = useStudySet();

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const view = pathParts[pathParts.length - 1];
    const setId = params.setId;

    if (setId) {
      setSelectedSetId(setId);
    }

    if (view === 'new') {
      setCurrentView('editSet');
    } else if (view === 'edit') {
      setCurrentView('editSet');
    } else if (view === 'cards') {
      setCurrentView('editCards');
    } else if (view === 'study') {
      setCurrentView('studyPlayer');
    } else {
      setCurrentView('list');
    }
  }, [location, params.setId, setSelectedSetId, setCurrentView]);

  const handleCreateNewSet = () => navigate('/my-sets/new');
  const handleEditSetDetails = (setId) => navigate(`/my-sets/${setId}/edit`);
  const handleEditSetCards = (setId) => navigate(`/my-sets/${setId}/cards`);
  const handleLaunchStudyPlayer = (setId) => navigate(`/my-sets/${setId}/study`);
  const showListView = () => navigate('/my-sets');

  const onSetSaved = (savedSetId) => {
    handleEditSetCards(savedSetId);
  };
  const onSetEditorCancelled = () => showListView();
  const onCardEditorFinished = () => showListView();
  const onPlayerExit = () => showListView();

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
  } else if (currentView === 'studyPlayer' && selectedSetId) {
    const setForPlayer = getStudySetById(selectedSetId);
    if (setForPlayer) {
      content = (
        <FlashcardPlayer
          studySetId={selectedSetId}
          initialSetData={setForPlayer}
          onExitPlayer={onPlayerExit}
          source="student"
        />
      );
    } else {
      alert(t('myStudySetsPage.errorSetNotFoundForPlayer', 'Could not find the set to study.'));
      showListView();
    }
  } else {
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
