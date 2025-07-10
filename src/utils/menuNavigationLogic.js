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
  // Upon language selection, FreestyleModePage should call onMenuSelect('day_selection_stage').
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
    children: ['vocabulary', 'grammar', 'reading', 'speaking', 'writing', 'listening', 'practice_all_main_cat']
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
      'grammar_conjugation_practice' // Added new exercise
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
  'listening': {
    parent: 'main_practice_categories_stage',
    // This key directly maps to ListeningPracticeHost in ExerciseHost
    isExercise: true
  },
  'practice_all_main_cat': {
    parent: 'main_practice_categories_stage',
    // This key directly maps to MainPracticeAllHost in ExerciseHost
    isExercise: true
  },

  // Vocabulary Sub-Practice Exercises (Leaf nodes)
  'vocab_random_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_random_image_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_match_image_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_listening_exercise': { parent: 'vocabulary', isExercise: true }, // This is a sub-host
  'vocab_type_opposite_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_match_opposites_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_build_word_exercise': { parent: 'vocabulary', isExercise: true },
  'vocab_practice_all_sub_host': { parent: 'vocabulary', isExercise: true },

  // Grammar Sub-Practice Exercises (Leaf nodes)
  'grammar_fill_gaps_exercise': { parent: 'grammar', isExercise: true },
  'grammar_type_verb_exercise': { parent: 'grammar', isExercise: true },
  'grammar_select_article_exercise': { parent: 'grammar', isExercise: true },
  'grammar_word_order_exercise': { parent: 'grammar', isExercise: true },
  'grammar_conjugation_practice': { parent: 'grammar', isExercise: true, i18nKey: 'subPractice.grammar.grammar_conjugation_practice' }, // Added new exercise definition

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

  // Handle 'entry_point' or direct stage calls like 'day_selection_stage'
  if (clickedItemKey === 'day_selection_stage' || itemConfig.parent === 'entry_point' || !itemConfig.parent) {
    newPath = [clickedItemKey];
  } else {
    // General case: find parent in current path and build new path from there
    const parentKey = itemConfig.parent;
    if (!parentKey) { // Should ideally not happen if not 'day_selection_stage'
        console.warn(`[handleMenuSelection] Item "${clickedItemKey}" has no parent but isn't a recognized root.`);
        newPath = [clickedItemKey]; // Fallback: start new path
    } else {
        const parentIndex = currentActivePath.lastIndexOf(parentKey);
        if (parentIndex !== -1) {
            // Parent is in the current path, slice up to and including parent, then add clicked item
            newPath = [...currentActivePath.slice(0, parentIndex + 1), clickedItemKey];
        } else {
            // Parent is NOT in the current path. This implies a jump or incorrect current path.
            // For robustness, we could try to rebuild from root to parent, then add clickedItem.
            // For now, let's assume a simpler scenario: if parent is defined, it means we are navigating deeper from it.
            // If the parent is not in the path, it's likely a fresh navigation to a category after day_confirm_action
            // or similar.
            // Example: currentPath=['day_selection_stage', 'day_confirm_action', 'main_practice_categories_stage']
            // clickedItemKey='vocabulary' (parent 'main_practice_categories_stage')
            // newPath should be ['day_selection_stage', 'day_confirm_action', 'main_practice_categories_stage', 'vocabulary']

            // A more robust way to handle this: If the item's parent is defined,
            // and the current path doesn't seem to lead to it directly,
            // we might need to reconstruct a valid path up to the parent.
            // However, the `parentIndex !== -1` check should mostly handle standard navigation.
            // If parentIndex is -1, it implies a jump.
            // For now, if parent is not in path, we'll just append, which might be wrong in complex jumps.
            // A better approach for jumps might be to define 'entryPoints' or specific handlers.
            // Let's refine this: if parent is defined, and the current path exists, assume we're appending to current valid path up to parent.
            // If currentActivePath doesn't contain parent, it's likely a fresh selection into a new branch.

            // If the last item in currentActivePath is the parent of the clicked item, then it's a direct child selection.
            if (currentActivePath.length > 0 && currentActivePath[currentActivePath.length -1] === parentKey) {
                 newPath = [...currentActivePath, clickedItemKey];
            } else {
                 // This case means the parent is not the immediate predecessor.
                 // This could be a jump, or the currentActivePath is stale.
                 // For initial category selection after 'main_practice_categories_stage',
                 // currentActivePath = [..., 'main_practice_categories_stage']
                 // clickedItemKey = 'vocabulary', parent = 'main_practice_categories_stage'
                 // So, this will correctly become [..., 'main_practice_categories_stage', 'vocabulary']

                 // If the parent is somewhere in the path, but not last, it means we are navigating back up to a sibling branch.
                 // Or, if it's the 'day_confirm_action' leading to 'main_practice_categories_stage'
                 if (itemConfig.parent === 'day_confirm_action' && clickedItemKey === 'main_practice_categories_stage') {
                     // This is a specific transition from day confirmation to categories.
                     // The path should be what currentActivePath was, plus 'main_practice_categories_stage'
                     // Assuming currentActivePath was [day_selection_stage, day_confirm_action]
                     newPath = [...currentActivePath, clickedItemKey];
                 } else if (menuConfig[parentKey] && menuConfig[parentKey].parent) { // Multi-level parent check
                    // Attempt to build a path if parent exists and has a known structure
                    // This part can get complex and needs a clear strategy for "jumping" vs "extending" path
                    // For now, let's assume simple extension if parent is found
                    let pathReconstruction = [parentKey, clickedItemKey];
                    let currentParent = menuConfig[parentKey].parent;
                    while(currentParent && menuConfig[currentParent]) {
                        pathReconstruction.unshift(currentParent);
                        if (currentParent === 'day_selection_stage') break; // Common root after language
                        currentParent = menuConfig[currentParent].parent;
                         if (!currentParent) pathReconstruction.unshift('day_selection_stage'); // Ensure base
                    }
                    if(!pathReconstruction.includes('day_selection_stage') && pathReconstruction.length > 0) {
                        // Ensure day_selection_stage is at the root if not already there from parent traversal
                        // This is a heuristic based on current app flow.
                        // newPath = ['day_selection_stage', ...pathReconstruction];
                    }
                    // For now, let's keep it simple: if parentIndex was -1, it's likely a new branch from a completed stage.
                    // The onMenuSelect in FreestyleModePage handles some of this logic by setting currentMain/Sub keys.
                    // This function should primarily focus on path construction based on parent/child/nextStage.
                    newPath = [...currentActivePath.slice(0, currentActivePath.indexOf(parentKey) + 1), clickedItemKey];
                    if (currentActivePath.indexOf(parentKey) === -1) { // Parent not in path, fresh branch
                        if (parentKey === 'main_practice_categories_stage' && currentActivePath.includes('day_confirm_action')) {
                             newPath = [...currentActivePath, parentKey, clickedItemKey]; // Path was up to day_confirm_action
                        } else {
                            newPath = [parentKey, clickedItemKey]; // Fallback to parent and child
                        }
                    }

                } else {
                     newPath = [parentKey, clickedItemKey]; // Fallback if parent has no further parent
                }
            }
        }
    }
  }

  // Append nextStage if defined for the clicked item
  if (itemConfig.nextStage) {
    newPath.push(itemConfig.nextStage);
  }

  // console.log(`[handleMenuSelection] PrevPath: "${currentActivePath.join(' -> ')}", Clicked: "${clickedItemKey}", NewPath: "${newPath.join(' -> ')}"`);
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
    // console.warn(`[isMenuItemVisible] Item key "${itemKey}" not found in menuConfig.`);
    return false;
  }

  const pathLength = currentActivePath.length;
  const currentActiveStage = pathLength > 0 ? currentActivePath[pathLength - 1] : null;

  // Rule 1: If the itemKey IS the current active stage, the item (component container) is considered visible.
  if (itemKey === currentActiveStage) {
    // This is for stages like 'main_practice_categories_stage' or 'vocabulary' (when it acts as a parent for sub-menu)
    // OR for leaf exercise nodes.
    return true;
  }

  // Rule 2: If the itemKey's PARENT is the current active stage, it's a direct child choice.
  if (itemConfig.parent === currentActiveStage) {
    // This covers buttons within a stage, e.g., 'vocabulary' button when 'main_practice_categories_stage' is active.
    // Special handling for mode selectors within day_selection_stage like 'day_single_input' (buttons)
    if (currentActiveStage === 'day_selection_stage' && (itemKey === 'day_single_input' || itemKey === 'day_range_input')) {
        // These buttons are visible if day_selection_stage is the active one,
        // AND a specific mode ('day_single_input' or 'day_range_input') isn't already the current stage.
        // i.e. path is just ['day_selection_stage']
        return pathLength === 1;
    }
    return true; // General child visibility
  }

  // Rule 3: Visibility for content sections controlled by mode selectors (e.g., the actual input fields for single day)
  // These are visible if their itemKey (which acts as a mode selector) is the currentActiveStage.
  // Example: itemKey 'day_single_input' (for the input fields section), currentActivePath is ['day_selection_stage', 'day_single_input']
  // This rule is effectively covered by Rule 1 (itemKey === currentActiveStage).
  // The distinction for 'isModeSelector' might be more relevant for `handleMenuSelection` or UI rendering.

  // Initial state: If path is empty, nothing is "visible" by this function's logic.
  // Components make initial calls to onMenuSelect to populate the path.
  if (pathLength === 0) {
    return false;
  }

  // Fallback: Not visible
  // console.log(`[isMenuItemVisible] Item "${itemKey}" determined NOT visible. Path: ${currentActivePath.join('/')}, Parent: ${itemConfig.parent}, CurrentStage: ${currentActiveStage}`);
  return false;
}

// console.log('[menuNavigationLogic.js] Loaded with reconstructed allMenuItemsConfig and implemented isMenuItemVisible.');
// The handleMenuSelection function remains a placeholder for now.
