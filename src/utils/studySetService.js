const LOCAL_STORAGE_KEY = 'COSY_STUDY_SETS';

/**
 * Retrieves all study sets from Local Storage.
 * @returns {Array} An array of study sets, or an empty array if none exist.
 */
export const getStudySets = () => {
  try {
    const setsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return setsJson ? JSON.parse(setsJson) : [];
  } catch (error) {
    console.error("Error parsing study sets from Local Storage:", error);
    return []; // Return empty array on error to prevent app crashes
  }
};

/**
 * Saves all study sets to Local Storage.
 * @param {Array} sets - The array of study sets to save.
 */
const _saveAllSets = (sets) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sets));
  } catch (error) {
    console.error("Error saving study sets to Local Storage:", error);
    // Consider how to handle this error in the UI if critical
  }
};

/**
 * Retrieves a specific study set by its ID.
 * @param {string} id - The ID of the study set to retrieve.
 * @returns {Object|null} The study set object if found, otherwise null.
 */
export const getStudySetById = (id) => {
  const sets = getStudySets();
  return sets.find(set => set.id === id) || null;
};

/**
 * Creates a new study set or updates an existing one.
 * If studySetData has an ID and it exists, it updates. Otherwise, it creates.
 * For creation, it generates an ID and timestamps.
 * For update, it updates the updatedAt timestamp.
 * @param {Object} studySetData - The study set data. Must include at least 'name'.
 *                                If 'id' is present and matches an existing set, it's an update.
 * @returns {Object} The created or updated study set.
 */
export const saveStudySet = (studySetData) => {
  if (!studySetData || !studySetData.name) {
    console.error("Study set data must include a name.");
    // Or throw an error: throw new Error("Study set data must include a name.");
    return null;
  }

  const sets = getStudySets();
  const now = new Date().toISOString();

  if (studySetData.id) { // Potential update
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
    // If ID provided but not found, treat as new set but log warning or error
    console.warn(`saveStudySet: ID ${studySetData.id} provided but no existing set found. Creating as new.`);
  }

  // Create new set
  const newSet = {
    id: studySetData.id || `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: studySetData.name,
    description: studySetData.description || '',
    languageCode: studySetData.languageCode || 'unknown', // Default or ensure this is provided
    createdAt: now,
    updatedAt: now,
    items: studySetData.items || [], // Ensure items array exists
    ...studySetData, // Allows passing other initial fields like languageCode directly
  };

  // If studySetData already had an ID but wasn't found (previous warning),
  // ensure the createdAt is not overwritten by spread if it was a "new" set with a given ID.
  if (studySetData.id && !sets.find(s => s.id === studySetData.id)) {
      newSet.createdAt = now; // Ensure createdAt is fresh for this "new" entry
  }


  sets.push(newSet);
  _saveAllSets(sets);
  return newSet;
};

/**
 * Deletes a study set by its ID.
 * @param {string} id - The ID of the study set to delete.
 * @returns {boolean} True if deletion was successful, false otherwise.
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

// --- Card Management Functions ---

/**
 * Adds a card to a specific study set.
 * @param {string} setId - The ID of the study set.
 * @param {Object} cardData - The data for the new card (must include term1, term2).
 * @returns {Object|null} The updated study set if successful, null otherwise.
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
    srsData: cardData.srsData || { // Default SRS data
        nextReviewDate: now,
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0
    },
    createdAt: now,
    updatedAt: now,
    ...cardData, // Allows passing other initial fields directly
  };
  // Ensure srsData is fully populated if partially provided or not at all
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
 * Updates an existing card within a specific study set.
 * @param {string} setId - The ID of the study set.
 * @param {string} cardId - The ID of the card to update.
 * @param {Object} updatedCardData - An object containing the card fields to update.
 * @returns {Object|null} The updated study set if successful, null otherwise.
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

  // Carefully merge srsData
  const newSrsData = updatedCardData.srsData
    ? { ...existingCard.srsData, ...updatedCardData.srsData }
    : existingCard.srsData;

  sets[setIndex].items[cardIndex] = {
    ...existingCard,
    ...updatedCardData, // Apply other updates
    srsData: newSrsData, // Ensure srsData is correctly merged/preserved
    updatedAt: now,
  };

  sets[setIndex].updatedAt = now;
  _saveAllSets(sets);
  return sets[setIndex];
};

/**
 * Deletes a card from a specific study set.
 * @param {string} setId - The ID of the study set.
 * @param {string} cardId - The ID of the card to delete.
 * @returns {Object|null} The updated study set if successful, null otherwise.
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
  return null; // Card not found, or no change made
};
