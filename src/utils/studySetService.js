const LOCAL_STORAGE_KEY = 'COSY_STUDY_SETS';

/**
 * Retrieves all study sets from local storage.
 * @returns {Array} An array of study sets.
 */
export const getStudySets = () => {
  try {
    const setsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return setsJson ? JSON.parse(setsJson) : [];
  } catch (error) {
    console.error("Error parsing study sets from Local Storage:", error);
    return [];
  }
};

/**
 * Saves all study sets to local storage.
 * @param {Array} sets - The array of study sets to save.
 */
const _saveAllSets = (sets) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sets));
  } catch (error) {
    console.error("Error saving study sets to Local Storage:", error);
  }
};

/**
 * Retrieves a study set by its ID.
 * @param {string} id - The ID of the study set to retrieve.
 * @returns {object|null} The study set, or null if it is not found.
 */
export const getStudySetById = (id) => {
  const sets = getStudySets();
  return sets.find(set => set.id === id) || null;
};

/**
 * Saves a study set.
 * If the study set has an ID, it will be updated. Otherwise, it will be created.
 * @param {object} studySetData - The study set data to save.
 * @returns {object|null} The saved study set, or null if the data is invalid.
 */
export const saveStudySet = (studySetData) => {
  if (!studySetData || !studySetData.name) {
    console.error("Study set data must include a name.");
    return null;
  }

  const sets = getStudySets();
  const now = new Date().toISOString();

  if (studySetData.id) {
    const existingSetIndex = sets.findIndex(set => set.id === studySetData.id);
    if (existingSetIndex !== -1) {
      sets[existingSetIndex] = {
        ...sets[existingSetIndex],
        ...studySetData,
        updatedAt: now,
      };
      _saveAllSets(sets);
      return sets[existingSetIndex];
    }
    console.warn(`saveStudySet: ID ${studySetData.id} provided but no existing set found. Creating as new.`);
  }

  const newSet = {
    id: studySetData.id || `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: studySetData.name,
    description: studySetData.description || '',
    languageCode: studySetData.languageCode || 'unknown',
    createdAt: now,
    updatedAt: now,
    items: studySetData.items || [],
    ...studySetData,
  };

  if (studySetData.id && !sets.find(s => s.id === studySetData.id)) {
      newSet.createdAt = now;
  }


  sets.push(newSet);
  _saveAllSets(sets);
  return newSet;
};

/**
 * Deletes a study set by its ID.
 * @param {string} id - The ID of the study set to delete.
 * @returns {boolean} Whether the study set was deleted successfully.
 */
export const deleteStudySet = (id) => {
  let sets = getStudySets();
  const initialLength = sets.length;
  sets = sets.filter(set => set.id !== id);
  if (sets.length < initialLength) {
    _saveAllSets(sets);
    return true;
  }
  return false;
};

/**
 * Adds a card to a study set.
 * @param {string} setId - The ID of the study set to add the card to.
 * @param {object} cardData - The data for the card to add.
 * @returns {object|null} The updated study set, or null if the set is not found or the card data is invalid.
 */
export const addCardToSet = (setId, cardData) => {
  if (!cardData || !cardData.term1 || !cardData.term2) {
    console.error("Card data must include term1 and term2.");
    return null;
  }
  const sets = getStudySets();
  const setIndex = sets.findIndex(set => set.id === setId);

  if (setIndex === -1) {
    console.error(`Study set with ID ${setId} not found.`);
    return null;
  }

  const now = new Date().toISOString();
  const newCard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    term1: cardData.term1,
    term2: cardData.term2,
    imageURI: cardData.imageURI || '',
    audioURI: cardData.audioURI || '',
    exampleSentence: cardData.exampleSentence || '',
    notes: cardData.notes || '',
    srsData: cardData.srsData || {
        nextReviewDate: now,
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0
    },
    createdAt: now,
    updatedAt: now,
    ...cardData,
  };
  newCard.srsData = {
    nextReviewDate: newCard.srsData?.nextReviewDate || now,
    intervalDays: newCard.srsData?.intervalDays || 1,
    easeFactor: newCard.srsData?.easeFactor || 2.5,
    repetitions: newCard.srsData?.repetitions || 0,
    lapses: newCard.srsData?.lapses || 0,
  };


  sets[setIndex].items.push(newCard);
  sets[setIndex].updatedAt = now;
  _saveAllSets(sets);
  return sets[setIndex];
};

/**
 * Updates a card in a study set.
 * @param {string} setId - The ID of the study set.
 * @param {string} cardId - The ID of the card to update.
 * @param {object} updatedCardData - The updated card data.
 * @returns {object|null} The updated study set, or null if the set or card is not found.
 */
export const updateCardInSet = (setId, cardId, updatedCardData) => {
  const sets = getStudySets();
  const setIndex = sets.findIndex(set => set.id === setId);

  if (setIndex === -1) {
    console.error(`Study set with ID ${setId} not found.`);
    return null;
  }

  const cardIndex = sets[setIndex].items.findIndex(card => card.id === cardId);

  if (cardIndex === -1) {
    console.error(`Card with ID ${cardId} not found in set ${setId}.`);
    return null;
  }

  const now = new Date().toISOString();
  const existingCard = sets[setIndex].items[cardIndex];

  const newSrsData = updatedCardData.srsData
    ? { ...existingCard.srsData, ...updatedCardData.srsData }
    : existingCard.srsData;

  sets[setIndex].items[cardIndex] = {
    ...existingCard,
    ...updatedCardData,
    srsData: newSrsData,
    updatedAt: now,
  };

  sets[setIndex].updatedAt = now;
  _saveAllSets(sets);
  return sets[setIndex];
};

/**
 * Deletes a card from a study set.
 * @param {string} setId - The ID of the study set.
 * @param {string} cardId - The ID of the card to delete.
 * @returns {object|null} The updated study set, or null if the set or card is not found.
 */
export const deleteCardFromSet = (setId, cardId) => {
  const sets = getStudySets();
  const setIndex = sets.findIndex(set => set.id === setId);

  if (setIndex === -1) {
    console.error(`Study set with ID ${setId} not found.`);
    return null;
  }

  const initialCardCount = sets[setIndex].items.length;
  sets[setIndex].items = sets[setIndex].items.filter(card => card.id !== cardId);

  if (sets[setIndex].items.length < initialCardCount) {
    sets[setIndex].updatedAt = new Date().toISOString();
    _saveAllSets(sets);
    return sets[setIndex];
  }

  console.warn(`Card with ID ${cardId} not found in set ${setId} for deletion.`);
  return null;
};
