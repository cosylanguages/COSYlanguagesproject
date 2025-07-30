import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import FlashcardPlayer from '../FlashcardPlayer';

const FlashcardsTool = () => {
  const { t } = useI18n();
  // TODO: Fetch flashcards from a data source
  const flashcards = [];

  return (
    <div>
      <h3>{t('studyMode.toolFlashcards', 'Flashcards')}</h3>
      {flashcards.length > 0 ? (
        <FlashcardPlayer cards={flashcards} />
      ) : (
        <p>{t('studyMode.noFlashcards', 'No flashcards available. Create some in the Dictionary tool!')}</p>
      )}
    </div>
  );
};

export default FlashcardsTool;
