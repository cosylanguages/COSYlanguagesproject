// @ts-check

/**
 * @returns {{ activePath: string[] }}
 */
export function getInitialMenuState() {
  // Initial state: No language selected, so path is empty.
  // Language selection will trigger the first navigation to 'day_selection_stage'.
  return { activePath: [] };
}

/**
 * Configuration for all menu items and their hierarchy.
 * - `parent`: Key of the parent item. Root items can have null or a conceptual parent like 'entry_point'.
 * - `children`: Array of item keys that are direct children of this item.
 * - `nextStage`: Key of the stage to automatically navigate to after this item is processed (e.g., after an action).
 * - `isExercise`: Boolean, true if selecting this item should directly lead to rendering an exercise.
 * - `isModeSelector`: Boolean, true if this item represents a mode choice within a component (e.g. day_single_input)
 */
export const allMenuItemsConfig = {
  // This 'entry_point' is conceptual. Language selection is the true entry.
  // Upon language selection, the LanguageIslandApp dispatches an event, which leads to showing the DaySelectorIsland.
  // The DaySelectorIsland's appearance/functionality implicitly represents the 'day_selection_stage'.
  'entry_point': {
    nextStage: 'day_selection_stage'
  },

  'day_selection_stage': {
    parent: 'entry_point', // Conceptually, after language is picked
    children: ['day_single_input', 'day_range_input'], // These are modes/choices within DaySelectorFreestyle
    // The component DaySelectorFreestyle is active here.
    // A button within DaySelectorFreestyle will trigger 'day_confirm_action'.
  },
  'day_single_input': {
    parent: 'day_selection_stage',
    isModeSelector: true, // Indicates it controls a UI mode within its parent's component
    // Does not have children in the menu navigation sense for path building.
    // Leads to 'day_confirm_action' via button click.
  },
  'day_range_input': {
    parent: 'day_selection_stage',
    isModeSelector: true,
    // Leads to 'day_confirm_action' via button click.
  },
  'day_confirm_action': {
    parent: 'day_selection_stage', // Action taken from day_selection_stage
    nextStage: 'main_practice_categories_stage'
  },

  'main_practice_categories_stage': {
    parent: 'day_confirm_action', // After days are confirmed
    // Component PracticeCategoryNav is active here.
    children: ['vocabulary', 'grammar', 'sentence_skills', 'reading', 'speaking', 'writing', 'listening', 'practice_all_main_cat'] // Added sentence_skills
  },

  // Main Categories
  'vocabulary': {
    parent: 'main_practice_categories_stage',
    // Component SubPracticeMenu is active here.
    children: [
      'vocab_random_word_exercise',
      'vocab_random_image_exercise',
      'vocab_match_image_word_exercise',
      'vocab_listening_exercise',
      'vocab_type_opposite_exercise',
      'vocab_match_opposites_exercise',
      'vocab_build_word_exercise',
      'vocab_practice_all_sub_host'
    ]
  },
  'grammar': {
    parent: 'main_practice_categories_stage',
    children: [
      'grammar_fill_gaps_exercise',
      'grammar_type_verb_exercise',
      'grammar_select_article_exercise',
      'grammar_word_order_exercise',
      'grammar_conjugation_practice'
    ]
  },
  'sentence_skills': { // New Category
    parent: 'main_practice_categories_stage',
    children: ['sentence_unscramble_exercise', 'fill_in_the_blanks_exercise'] // Added fill_in_the_blanks_exercise
  },
  'reading': {
    parent: 'main_practice_categories_stage',
    children: ['reading_story_exercise', 'reading_interesting_fact_exercise']
  },
  'speaking': {
    parent: 'main_practice_categories_stage',
    children: ['speaking_question_exercise', 'speaking_monologue_exercise', 'speaking_role_play_exercise']
  },
  'writing': {
    parent: 'main_practice_categories_stage',
    children: ['writing_question_exercise', 'writing_storytelling_exercise', 'writing_diary_exercise']
  },
  'listening': {
    parent: 'main_practice_categories_stage',
    isExercise: true
  },
  'practice_all_main_cat': {
    parent: 'main_practice_categories_stage',
    isExercise: true
  },

  // Vocabulary Sub-Practice Exercises (Leaf nodes)
  'vocab_random_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_random_image_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_match_image_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_listening_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_type_opposite_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_match_opposites_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_build_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_practice_all_sub_host': { parent: 'vocabulary', isExercise: true },

  // Grammar Sub-Practice Exercises (Leaf nodes)
  'grammar_fill_gaps_exercise': { parent: 'grammar', isExercise: true },
  'grammar_type_verb_exercise': { parent: 'grammar', isExercise: true },
  'grammar_select_article_exercise': { parent: 'grammar', isExercise: true },
  'grammar_word_order_exercise': { parent: 'grammar', isExercise: true },
  'grammar_conjugation_practice': { parent: 'grammar', isExercise: true, i18nKey: 'subPractice.grammar.grammar_conjugation_practice' },

  // Sentence Skills Sub-Practice Exercises (Leaf nodes) - New
  'sentence_unscramble_exercise': { parent: 'sentence_skills', isExercise: true, i18nKey: 'subPractice.sentenceSkills.sentence_unscramble_exercise' },
  'fill_in_the_blanks_exercise': { parent: 'sentence_skills', isExercise: true, i18nKey: 'subPractice.sentenceSkills.fill_in_the_blanks_exercise' },

  // Reading Sub-Practice Exercises (Leaf nodes)
  'reading_story_exercise': { parent: 'reading', isExercise: true },
  'reading_interesting_fact_exercise': { parent: 'reading', isExercise: true },

  // Speaking Sub-Practice Exercises (Leaf nodes)
  'speaking_question_exercise': { parent: 'speaking', isExercise: true },
  'speaking_monologue_exercise': { parent: 'speaking', isExercise: true },
  'speaking_role_play_exercise': { parent: 'speaking', isExercise: true },

  // Writing Sub-Practice Exercises (Leaf nodes)
  'writing_question_exercise': { parent: 'writing', isExercise: true },
  'writing_storytelling_exercise': { parent: 'writing', isExercise: true },
  'writing_diary_exercise': { parent: 'writing', isExercise: true },
};


/**
 * Determines the new active path based on the item clicked and current path.
 * @param {string[]} currentActivePath - The current active menu path.
 * @param {string} clickedItemKey - The key of the menu item that was clicked.
 * @param {object} menuConfig - The configuration object for all menu items.
 * @returns {{ activePath: string[] }} The new menu state.
 */
export function handleMenuSelection(currentActivePath, clickedItemKey, menuConfig) {
  const itemConfig = menuConfig[clickedItemKey];

  if (!itemConfig) {
    console.warn(`[handleMenuSelection] Clicked item key "${clickedItemKey}" not found in menuConfig.`);
    return { activePath: currentActivePath }; // Return current path if item is unknown
  }

  let newPath = [];

  if (clickedItemKey === 'day_selection_stage' || itemConfig.parent === 'entry_point' || !itemConfig.parent) {
    newPath = [clickedItemKey];
  } else {
    const parentKey = itemConfig.parent;
    if (!parentKey) {
        console.warn(`[handleMenuSelection] Item "${clickedItemKey}" has no parent but isn't a recognized root.`);
        newPath = [clickedItemKey];
    } else {
        const parentIndex = currentActivePath.lastIndexOf(parentKey);
        if (parentIndex !== -1) {
            newPath = [...currentActivePath.slice(0, parentIndex + 1), clickedItemKey];
        } else {
            if (currentActivePath.length > 0 && currentActivePath[currentActivePath.length -1] === parentKey) {
                 newPath = [...currentActivePath, clickedItemKey];
            } else {
                 if (itemConfig.parent === 'day_confirm_action' && clickedItemKey === 'main_practice_categories_stage') {
                     newPath = [...currentActivePath, clickedItemKey];
                 } else if (menuConfig[parentKey] && menuConfig[parentKey].parent) {
                    let pathReconstruction = [parentKey, clickedItemKey];
                    let currentParent = menuConfig[parentKey].parent;
                    while(currentParent && menuConfig[currentParent]) {
                        pathReconstruction.unshift(currentParent);
                        if (currentParent === 'day_selection_stage') break;
                        currentParent = menuConfig[currentParent].parent;
                         if (!currentParent) pathReconstruction.unshift('day_selection_stage');
                    }
                    if(!pathReconstruction.includes('day_selection_stage') && pathReconstruction.length > 0) {
                    }
                    newPath = [...currentActivePath.slice(0, currentActivePath.indexOf(parentKey) + 1), clickedItemKey];
                    if (currentActivePath.indexOf(parentKey) === -1) {
                        if (parentKey === 'main_practice_categories_stage' && currentActivePath.includes('day_confirm_action')) {
                             newPath = [...currentActivePath, parentKey, clickedItemKey];
                        } else {
                            newPath = [parentKey, clickedItemKey];
                        }
                    }

                } else {
                     newPath = [parentKey, clickedItemKey];
                }
            }
        }
    }
  }

  if (itemConfig.nextStage) {
    newPath.push(itemConfig.nextStage);
  }

  return { activePath: newPath };
}

/**
 * Determines if a menu item should be visible based on the current active path.
 * @param {string[]} currentActivePath - The current active menu path.
 * @param {string} itemKey - The key of the menu item to check for visibility.
 * @param {object} menuConfig - The configuration object for all menu items.
 * @returns {boolean} True if the item should be visible, false otherwise.
 */
export function isMenuItemVisible(currentActivePath, itemKey, menuConfig) {
  const itemConfig = menuConfig[itemKey];
  if (!itemConfig) {
    return false;
  }

  const pathLength = currentActivePath.length;
  const currentActiveStage = pathLength > 0 ? currentActivePath[pathLength - 1] : null;

  if (itemKey === currentActiveStage) {
    return true;
  }

  if (itemConfig.parent === currentActiveStage) {
    if (currentActiveStage === 'day_selection_stage' && (itemKey === 'day_single_input' || itemKey === 'day_range_input')) {
        return pathLength === 1;
    }
    return true;
  }

  if (pathLength === 0) {
    return false;
  }
  return false;
}
