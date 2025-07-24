/**
 * Gets the initial state for the menu.
 * @returns {{ activePath: string[] }} The initial menu state.
 */
export function getInitialMenuState() {
  return { activePath: [] };
}

/**
 * A configuration object for all the menu items and their hierarchy.
 */
export const allMenuItemsConfig = {
  'entry_point': {
    nextStage: 'day_selection_stage'
  },

  'day_selection_stage': {
    parent: 'entry_point',
    children: ['day_single_input', 'day_range_input'],
  },
  'day_single_input': {
    parent: 'day_selection_stage',
    isModeSelector: true,
  },
  'day_range_input': {
    parent: 'day_selection_stage',
    isModeSelector: true,
  },
  'day_confirm_action': {
    parent: 'day_selection_stage',
    nextStage: 'main_practice_categories_stage'
  },

  'main_practice_categories_stage': {
    parent: 'day_confirm_action',
    children: ['vocabulary', 'grammar', 'reading', 'speaking', 'writing']
  },

  'vocabulary': {
    parent: 'main_practice_categories_stage',
    children: [
      'vocabulary_random_word_image',
      'vocabulary_opposites_match',
      'vocabulary_letters_scramble',
      'vocabulary_true_false',
      'vocabulary_listening',
      'vocabulary_practice_all'
    ]
  },
  'grammar': {
    parent: 'main_practice_categories_stage',
    children: [
      'grammar_fill_gaps_exercise',
      'grammar_type_verb_exercise',
      'grammar_select_article_exercise',
      'grammar_word_order_exercise',
      'grammar_conjugation_practice',
      'sentence_unscramble_exercise',
      'fill_in_the_blanks_exercise'
    ]
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

  'vocabulary_random_word_image': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_random_word_image' },
  'vocabulary_opposites_match': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_opposites_match' },
  'vocabulary_letters_scramble': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_letters_scramble' },
  'vocabulary_true_false': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_true_false' },
  'vocabulary_listening': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_listening' },
  'vocabulary_practice_all': { parent: 'vocabulary', isExercise: true, i18nKey: 'subPractice.vocabulary.vocabulary_practice_all' },

  'grammar_fill_gaps_exercise': { parent: 'grammar', isExercise: true },
  'grammar_type_verb_exercise': { parent: 'grammar', isExercise: true },
  'grammar_select_article_exercise': { parent: 'grammar', isExercise: true },
  'grammar_word_order_exercise': { parent: 'grammar', isExercise: true },
  'grammar_conjugation_practice': { parent: 'grammar', isExercise: true, i18nKey: 'subPractice.grammar.grammar_conjugation_practice' },
  'sentence_unscramble_exercise': { parent: 'grammar', isExercise: true, i18nKey: 'subPractice.grammar.sentence_unscramble_exercise' },
  'fill_in_the_blanks_exercise': { parent: 'grammar', isExercise: true, i18nKey: 'subPractice.grammar.fill_in_the_blanks_exercise' },

  'reading_story_exercise': { parent: 'reading', isExercise: true },
  'reading_interesting_fact_exercise': { parent: 'reading', isExercise: true },

  'speaking_question_exercise': { parent: 'speaking', isExercise: true },
  'speaking_monologue_exercise': { parent: 'speaking', isExercise: true },
  'speaking_role_play_exercise': { parent: 'speaking', isExercise: true },

  'writing_question_exercise': { parent: 'writing', isExercise: true },
  'writing_storytelling_exercise': { parent: 'writing', isExercise: true },
  'writing_diary_exercise': { parent: 'writing', isExercise: true },
};


/**
 * Determines the new active path based on the item clicked and the current path.
 * @param {string[]} currentActivePath - The current active menu path.
 * @param {string} clickedItemKey - The key of the menu item that was clicked.
 * @param {object} menuConfig - The configuration object for all menu items.
 * @returns {{ activePath: string[] }} The new menu state.
 */
export function handleMenuSelection(currentActivePath, clickedItemKey, menuConfig) {
  const itemConfig = menuConfig[clickedItemKey];

  if (!itemConfig) {
    console.warn(`[handleMenuSelection] Clicked item key "${clickedItemKey}" not found in menuConfig.`);
    return { activePath: currentActivePath };
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
