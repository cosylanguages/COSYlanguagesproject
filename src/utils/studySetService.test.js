import {
  getStudySets,
  getStudySetById,
  saveStudySet,
  deleteStudySet,
  addCardToSet,
  updateCardInSet,
  deleteCardFromSet,
} from './studySetService';

const LOCAL_STORAGE_KEY = 'COSY_STUDY_SETS';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('studySetService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Reset console spies if any were set up
    jest.restoreAllMocks();
  });

  describe('getStudySets', () => {
    it('should return an empty array if no sets are in localStorage', () => {
      expect(getStudySets()).toEqual([]);
    });

    it('should return parsed sets from localStorage', () => {
      const mockSets = [{ id: '1', name: 'Set 1', items: [] }];
      localStorageMock.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockSets));
      expect(getStudySets()).toEqual(mockSets);
    });

    it('should return an empty array and log error if localStorage data is malformed', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
      localStorageMock.setItem(LOCAL_STORAGE_KEY, 'malformed_json');
      expect(getStudySets()).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('saveStudySet', () => {
    it('should create a new set with id and timestamps if no id is provided', () => {
      const newSetData = { name: 'New Set', description: 'A new test set' };
      const savedSet = saveStudySet(newSetData);
      expect(savedSet.id).toBeDefined();
      expect(savedSet.name).toBe('New Set');
      expect(savedSet.description).toBe('A new test set');
      expect(savedSet.createdAt).toBeDefined();
      expect(savedSet.updatedAt).toBe(savedSet.createdAt);
      expect(savedSet.items).toEqual([]);

      const sets = getStudySets();
      expect(sets.length).toBe(1);
      expect(sets[0]).toEqual(savedSet);
    });

    it('should update an existing set if id matches', () => {
      const initialSet = saveStudySet({ name: 'Initial Set' });
      const updatedData = { id: initialSet.id, name: 'Updated Set Name', description: 'Updated desc' };

      // Mock Date.toISOString for predictable updatedAt
      const mockDate = new Date('2023-01-02T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const updatedSet = saveStudySet(updatedData);

      jest.restoreAllMocks(); // Restore Date mock

      expect(updatedSet.name).toBe('Updated Set Name');
      expect(updatedSet.description).toBe('Updated desc');
      expect(updatedSet.id).toBe(initialSet.id);
      expect(updatedSet.createdAt).toBe(initialSet.createdAt);
      expect(updatedSet.updatedAt).toBe(mockDate.toISOString());

      const sets = getStudySets();
      expect(sets.length).toBe(1);
      expect(sets[0].name).toBe('Updated Set Name');
    });

    it('should create a new set if id is provided but does not exist, and log a warning', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      const newSetData = { id: 'nonexistent-id', name: 'Set with specific ID' };
      const savedSet = saveStudySet(newSetData);

      expect(savedSet.id).toBe('nonexistent-id');
      expect(savedSet.name).toBe('Set with specific ID');
      expect(savedSet.createdAt).toBeDefined();
      expect(savedSet.updatedAt).toBe(savedSet.createdAt);
      expect(console.warn).toHaveBeenCalledWith('saveStudySet: ID nonexistent-id provided but no existing set found. Creating as new.');

      const sets = getStudySets();
      expect(sets.length).toBe(1);
      expect(sets[0].id).toBe('nonexistent-id');
      jest.restoreAllMocks();
    });

    it('should return null and log error if name is not provided', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = saveStudySet({ description: 'No name set' });
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Study set data must include a name.');
      expect(getStudySets().length).toBe(0);
    });
  });

  describe('getStudySetById', () => {
    it('should return the correct set if found', () => {
      const set1 = saveStudySet({ name: 'Set 1' });
      saveStudySet({ name: 'Set 2' });
      expect(getStudySetById(set1.id)).toEqual(set1);
    });

    it('should return null if set not found', () => {
      saveStudySet({ name: 'Set 1' });
      expect(getStudySetById('nonexistent-id')).toBeNull();
    });
  });

  describe('deleteStudySet', () => {
    it('should delete the specified set and return true', () => {
      const set1 = saveStudySet({ name: 'Set 1' });
      const set2 = saveStudySet({ name: 'Set 2' });
      expect(getStudySets().length).toBe(2);

      const result = deleteStudySet(set1.id);
      expect(result).toBe(true);
      const sets = getStudySets();
      expect(sets.length).toBe(1);
      expect(sets[0].id).toBe(set2.id);
    });

    it('should return false if set to delete is not found', () => {
      saveStudySet({ name: 'Set 1' });
      const result = deleteStudySet('nonexistent-id');
      expect(result).toBe(false);
      expect(getStudySets().length).toBe(1);
    });
  });

  describe('Card Management', () => {
    let setId;
    beforeEach(() => {
      const set = saveStudySet({ name: 'Card Test Set' });
      setId = set.id;
    });

    describe('addCardToSet', () => {
      it('should add a card to the specified set', () => {
        const cardData = { term1: 'Hello', term2: 'Bonjour' };
        const updatedSet = addCardToSet(setId, cardData);
        expect(updatedSet.items.length).toBe(1);
        expect(updatedSet.items[0].term1).toBe('Hello');
        expect(updatedSet.items[0].id).toBeDefined();
        expect(updatedSet.items[0].createdAt).toBeDefined();
        expect(updatedSet.items[0].updatedAt).toBe(updatedSet.items[0].createdAt);
        expect(updatedSet.items[0].srsData).toBeDefined();
        expect(updatedSet.updatedAt).toBe(updatedSet.items[0].updatedAt); // Set's updatedAt also updates
      });

      it('should return null if card data is invalid', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(addCardToSet(setId, { term1: 'incomplete' })).toBeNull();
        expect(console.error).toHaveBeenCalledWith("Card data must include term1 and term2.");
      });

      it('should return null if set ID is not found', () => {
         jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(addCardToSet('wrong-set-id', { term1: 'T1', term2: 'T2' })).toBeNull();
        expect(console.error).toHaveBeenCalledWith("Study set with ID wrong-set-id not found.");
      });
    });

    describe('updateCardInSet', () => {
      let cardId;
      let originalDateNow;
      const mockDate = new Date('2023-01-02T00:00:00.000Z');

      beforeEach(() => {
        const setWithCard = addCardToSet(setId, { term1: 'Initial T1', term2: 'Initial T2' });
        cardId = setWithCard.items[0].id;

        // Mock Date for consistent updatedAt
        originalDateNow = Date.now;
        global.Date.now = jest.fn(() => mockDate.getTime());
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      });

      afterEach(() => {
        global.Date.now = originalDateNow;
        jest.restoreAllMocks(); // This will also restore the global Date constructor
      });

      it('should update the specified card', () => {
        const cardUpdates = { term1: 'Updated T1', notes: 'Some notes' };
        const updatedSet = updateCardInSet(setId, cardId, cardUpdates);
        expect(updatedSet.items[0].term1).toBe('Updated T1');
        expect(updatedSet.items[0].term2).toBe('Initial T2');
        expect(updatedSet.items[0].notes).toBe('Some notes');
        expect(updatedSet.items[0].updatedAt).toBe(mockDate.toISOString());
        // Ensure createdAt is different if the original addCardToSet happened at a different "time"
        // This requires careful sequencing or mocking Date from the very start of the parent describe.
        // For now, checking against the mocked date is more direct for `updatedAt`.
        // We can also check it's different from a previously captured createdAt if Date wasn't mocked for add.
        expect(updatedSet.items[0].updatedAt).not.toBe(updatedSet.items[0].createdAt);
      });

      it('should correctly merge SRS data if provided', () => {
        const srsUpdates = { srsData: { intervalDays: 5, easeFactor: 2.6 } };
        const setBeforeUpdate = getStudySetById(setId);
        const originalRepetitions = setBeforeUpdate.items[0].srsData.repetitions;

        const updatedSet = updateCardInSet(setId, cardId, srsUpdates);
        expect(updatedSet.items[0].srsData.intervalDays).toBe(5);
        expect(updatedSet.items[0].srsData.easeFactor).toBe(2.6);
        expect(updatedSet.items[0].srsData.repetitions).toBe(originalRepetitions); // Ensure other SRS fields are preserved
      });

      it('should return null if card ID is not found', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(updateCardInSet(setId, 'wrong-card-id', { term1: 'Update Fail' })).toBeNull();
         expect(console.error).toHaveBeenCalledWith(`Card with ID wrong-card-id not found in set ${setId}.`);
      });
    });

    describe('deleteCardFromSet', () => {
      let cardId1, cardId2;
      beforeEach(() => {
        let set = addCardToSet(setId, { term1: 'Card 1 T1', term2: 'Card 1 T2' });
        cardId1 = set.items[0].id;
        set = addCardToSet(setId, { term1: 'Card 2 T1', term2: 'Card 2 T2' });
        cardId2 = set.items.find(c => c.id !== cardId1).id; // Get the second card's ID
      });

      it('should delete the specified card from the set', () => {
        const setBeforeDelete = getStudySetById(setId);
        expect(setBeforeDelete.items.length).toBe(2);

        const updatedSet = deleteCardFromSet(setId, cardId1);
        expect(updatedSet.items.length).toBe(1);
        expect(updatedSet.items.find(card => card.id === cardId1)).toBeUndefined();
        expect(updatedSet.items[0].id).toBe(cardId2);
      });

      it('should return null if card to delete is not found', () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = deleteCardFromSet(setId, 'nonexistent-card-id');
        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalledWith(`Card with ID nonexistent-card-id not found in set ${setId} for deletion.`);
        const currentSet = getStudySetById(setId);
        expect(currentSet.items.length).toBe(2); // No change
      });
    });
  });
});
