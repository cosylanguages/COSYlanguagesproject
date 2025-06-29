import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ProgressContext = createContext();
const SRS_STORAGE_KEY = 'COSY_SRS_DATA';

// Define SRS intervals (in days) for proficiency buckets 0 through N
// Bucket 0: New item or incorrect, review very soon (e.g., a few hours or same day).
// Bucket 1: Learned, review in 1 day.
// Bucket 2: Review in 3 days.
// Bucket 3: Review in 7 days.
// Bucket 4: Review in 14 days.
// Bucket 5: Review in 30 days (considered "mastered" for current cycle)
const SRS_INTERVALS = [0.1, 1, 3, 7, 14, 30]; // 0.1 for ~2.4 hours for new/incorrect items
const MAX_PROFICIENCY_BUCKET = SRS_INTERVALS.length - 1;

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [learningItems, setLearningItems] = useState({});

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SRS_STORAGE_KEY);
      if (savedData) {
        setLearningItems(JSON.parse(savedData));
      }
      console.log("[ProgressContext] SRS data loaded from localStorage:", savedData ? JSON.parse(savedData) : {});
    } catch (error) {
      console.error("[ProgressContext] Error loading SRS data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(learningItems));
      console.log("[ProgressContext] SRS data saved to localStorage:", learningItems);
    } catch (error) {
      console.error("[ProgressContext] Error saving SRS data to localStorage:", error);
    }
  }, [learningItems]);

  const getLearningItemKey = useCallback((itemId, itemType, language) => {
    // Ensure consistent key generation, e.g., by lowercasing and trimming parts if necessary,
    // though for now, direct concatenation is used as per original GameState logic.
    return `${String(language)}_${String(itemType)}_${String(itemId)}`;
  }, []);
  
  const getLearningItem = useCallback((itemId, itemType, language) => {
    const itemKey = getLearningItemKey(itemId, itemType, language);
    return learningItems[itemKey] || {
      itemId: String(itemId),
      itemType: String(itemType),
      language: String(language),
      proficiencyBucket: 0,
      lastReviewedDate: null,
      nextReviewDate: new Date().toISOString(), // New items are due immediately
      consecutiveCorrectAnswers: 0,
      totalAttempts: 0,
      totalCorrect: 0,
    };
  }, [learningItems, getLearningItemKey]);

  const scheduleReview = useCallback((itemId, itemType, language, isCorrect) => {
    setLearningItems(prevItems => {
      const itemKey = getLearningItemKey(itemId, itemType, language);
      // Use the getLearningItem to ensure we have a base structure even if it's new
      const currentItem = prevItems[itemKey] || getLearningItem(itemId, itemType, language);
      
      const newItemData = { ...currentItem };
      newItemData.totalAttempts = (newItemData.totalAttempts || 0) + 1;
      newItemData.lastReviewedDate = new Date().toISOString();

      if (isCorrect) {
        newItemData.totalCorrect = (newItemData.totalCorrect || 0) + 1;
        newItemData.consecutiveCorrectAnswers = (newItemData.consecutiveCorrectAnswers || 0) + 1;
        newItemData.proficiencyBucket = Math.min(MAX_PROFICIENCY_BUCKET, (currentItem.proficiencyBucket || 0) + 1);
      } else {
        newItemData.consecutiveCorrectAnswers = 0;
        // For incorrect answers, move back one bucket, or to bucket 0
        newItemData.proficiencyBucket = Math.max(0, (currentItem.proficiencyBucket || 0) - 1); 
      }
      
      const intervalDays = SRS_INTERVALS[newItemData.proficiencyBucket];
      const nextReview = new Date();
      if (intervalDays < 1) { // Handle fractional days (hours)
        nextReview.setTime(nextReview.getTime() + intervalDays * 24 * 60 * 60 * 1000);
      } else {
        nextReview.setDate(nextReview.getDate() + intervalDays);
      }
      newItemData.nextReviewDate = nextReview.toISOString();

      console.log(`[ProgressContext] Processed review for: ${itemKey}, Correct: ${isCorrect}, New Bucket: ${newItemData.proficiencyBucket}, Next Review: ${newItemData.nextReviewDate}`);
      return {
        ...prevItems,
        [itemKey]: newItemData,
      };
    });
  }, [getLearningItem, getLearningItemKey]);
  
  const awardCorrectAnswer = useCallback((itemId, itemType, language) => {
    console.log(`[ProgressContext] Correct answer for: ${itemType} - ${itemId} in ${language}`);
    scheduleReview(itemId, itemType, language, true);
  }, [scheduleReview]);

  const awardIncorrectAnswer = useCallback((itemId, itemType, language) => {
    console.log(`[ProgressContext] Incorrect answer for: ${itemType} - ${itemId} in ${language}`);
    scheduleReview(itemId, itemType, language, false);
  }, [scheduleReview]);

  const getItemProficiency = useCallback((itemId, itemType, language) => {
    const item = getLearningItem(itemId, itemType, language);
    return item.proficiencyBucket;
  }, [getLearningItem]);

  const getDueReviewItems = useCallback((language = null, itemType = null, maxItems = 10) => {
    const now = new Date().toISOString();
    const dueItems = Object.values(learningItems)
      .filter(item => {
        const langMatch = language ? item.language === language : true;
        const typeMatch = itemType ? item.itemType === itemType : true;
        // Ensure nextReviewDate exists and is not in the future
        const isDue = item.nextReviewDate && item.nextReviewDate <= now;
        return langMatch && typeMatch && isDue;
      })
      .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate)); // Oldest due first
    
    console.log(`[ProgressContext] Getting due review items (lang: ${language}, type: ${itemType}). Found: ${dueItems.length} due out of ${Object.keys(learningItems).length} total.`);
    return dueItems.slice(0, maxItems);
  }, [learningItems]);
  
  const resetAllSrsProgress = useCallback(() => {
    setLearningItems({});
    // localStorage.removeItem(SRS_STORAGE_KEY); // Handled by useEffect for learningItems
    console.log("[ProgressContext] All SRS progress has been reset.");
  }, []);

  const value = {
    awardCorrectAnswer,
    awardIncorrectAnswer,
    scheduleReview, 
    getItemProficiency,
    getDueReviewItems,
    learningItems, 
    resetAllSrsProgress,
    getLearningItem, // Exposing for potential direct use or inspection
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
