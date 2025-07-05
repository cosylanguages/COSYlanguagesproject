// @ts-check

/**
 * @typedef {string[]} MenuPath
 */

/**
 * @typedef {Object.<string, { children?: string[], parent?: string, isExclusiveDaySelector?: boolean }>} MenuItemsConfig
 * Represents the structure of the menu.
 * Example:
 * {
 *   lang: { children: ['days'] },
 *   days: { parent: 'lang', children: ['day_single_input', 'day_range_input', 'main_categories'], isExclusiveDaySelectorContainer: true },
 *   day_single_input: { parent: 'days', isExclusiveDaySelector: true },
 *   day_range_input: { parent: 'days', isExclusiveDaySelector: true },
 *   main_categories: { parent: 'days', children: ['vocabulary', 'grammar', 'listening', 'practice_all_main'] },
 *   vocabulary: { parent: 'main_categories', children: ['vocab_random_word', 'vocab_random_image', 'vocab_practice_all_sub'] },
 *   // ... and so on
 * }
 */

/**
 * Defines the initial state of the menu.
 * For now, assuming the top-level items (like language selector) are implicitly handled by components
 * and this logic kicks in after an initial selection, or `activePath` being empty implies top level.
 * @returns {{ activePath: MenuPath }}
 */
export function getInitialMenuState() {
  return { activePath: [] };
}

/**
 * Handles menu selection and returns the new menu state.
 * @param {MenuPath} currentActivePath - The current active menu path.
 * @param {string} clickedItemKey - The key/ID of the menu item that was clicked.
 * @param {MenuItemsConfig} menuConfig - The configuration object for the entire menu structure.
 * @returns {{ activePath: MenuPath }} - The new menu state.
 */
export function handleMenuSelection(currentActivePath, clickedItemKey, menuConfig) {
  const clickedItemConfig = menuConfig[clickedItemKey];
  if (!clickedItemConfig) {
    console.warn(`[menuNavigationLogic] Clicked item key "${clickedItemKey}" not found in menuConfig.`);
    return { activePath: currentActivePath }; // No change if item not found
  }

  // Construct the full path to the clicked item
  // This requires knowing the parent of clickedItemKey. The config should provide this.
  let pathForClickedItem = [clickedItemKey];
  let currentParentKey = clickedItemConfig.parent;
  while (currentParentKey) {
    pathForClickedItem.unshift(currentParentKey);
    currentParentKey = menuConfig[currentParentKey]?.parent;
  }
  
  const currentActivePathStr = currentActivePath.join('/');
  const pathForClickedItemStr = pathForClickedItem.join('/');

  let newActivePath;

  if (currentActivePathStr === pathForClickedItemStr) {
    // Clicked on the currently active item (the one whose children are showing).
    // This means "go up" or "toggle off".
    newActivePath = pathForClickedItem.slice(0, -1);
  } else {
    // Clicked on a new item to open it, or a sibling, or a child of a non-active item.
    // This will make the clicked item's path the new active path.
    newActivePath = pathForClickedItem;
  }
  
  // Special handling for day selection:
  // If we just selected a day input method (e.g., 'day_single_input' or 'day_range_input'),
  // and its parent is the 'days' container, we might want to advance the path
  // to a common state like 'days_selected' to indicate categories should show.
  // This needs to be more robustly defined in menuConfig.
  // For now, the generic logic above will make 'day_single_input' active.
  // Components will use isMenuItemVisible to show/hide accordingly.

  return { activePath: newActivePath };
}

/**
 * Determines if a menu item should be visible based on the current active path.
 * @param {MenuPath} currentActivePath - The current active menu path.
 * @param {string} itemKey - The key/ID of the menu item to check for visibility.
 * @param {MenuItemsConfig} menuConfig - The configuration object for the entire menu structure.
 * @returns {boolean} - True if the item should be visible, false otherwise.
 */
export function isMenuItemVisible(currentActivePath, itemKey, menuConfig) {
  const itemConfig = menuConfig[itemKey];
  if (!itemConfig) {
    // console.warn(`[menuNavigationLogic] Item key "${itemKey}" for visibility check not found in menuConfig.`);
    return false; // Item not in config, so not visible by this logic
  }

  // Construct the full path to the item being checked for visibility
  let pathForItem = [itemKey];
  let currentParentKey = itemConfig.parent;
  while (currentParentKey) {
    pathForItem.unshift(currentParentKey);
    currentParentKey = menuConfig[currentParentKey]?.parent;
  }

  // An item is visible if:
  // 1. Its own path is a prefix of the currentActivePath (meaning it's an ancestor of the active leaf or the active leaf itself).
  //    Example: currentActivePath = ['days', 'vocabulary', 'randomWord'], item 'vocabulary' is visible.
  // 2. Or, its parent's path matches the currentActivePath (meaning it's a direct child of the active leaf node and should be displayed as an option).
  //    Example: currentActivePath = ['days', 'vocabulary'], item 'randomWord' (child of 'vocabulary') is visible.
  // 3. Or, if currentActivePath is empty, only top-level items (those without a parent) are visible.

  if (currentActivePath.length === 0) {
    return !itemConfig.parent; // Visible if it's a top-level item
  }

  const parentOfItemPathStr = pathForItem.slice(0, -1).join('/');
  const currentActivePathStr = currentActivePath.join('/');
  const itemPathStr = pathForItem.join('/');

  // Case 1: Item is an ancestor or the active item itself.
  if (currentActivePathStr.startsWith(itemPathStr)) {
    return true;
  }

  // Case 2: Item is a direct child of the currently active item.
  if (parentOfItemPathStr === currentActivePathStr) {
     // Special rule for day selectors: if a specific day input is active, hide the other.
     // And if main_categories are active under 'days', hide both day input types.
     const parentConfig = menuConfig[itemConfig.parent];
     if (parentConfig?.isExclusiveDaySelectorContainer) {
         const activeSiblingKey = currentActivePath[currentActivePath.length -1];
         const activeSiblingConfig = menuConfig[activeSiblingKey];

         if (itemConfig.isExclusiveDaySelector) {
            // If a day selector is active, only that one is visible among its siblings.
            // If something else under 'days' (like 'main_categories') is active, hide all day selectors.
            if (activeSiblingConfig?.isExclusiveDaySelector) {
                return itemKey === activeSiblingKey;
            } else {
                 // If the active item under 'days' is NOT a day selector (e.g. 'main_categories'),
                 // then hide all day selectors.
                return false;
            }
         }
     }
    return true;
  }
  
  return false;
}

/**
 * Placeholder for the menu items configuration.
 * This will be defined in detail in the next step.
 * `parent` property is crucial for path reconstruction.
 * `isExclusiveDaySelectorContainer` on 'days' key.
 * `isExclusiveDaySelector` on 'day_single_input' and 'day_range_input'.
 * @type {MenuItemsConfig}
 */
export const allMenuItemsConfig = {
  // Phase 1: Language Selection (Implicitly handled by UI, path starts as [])
  // Stage: Day Selection - This key represents the "container" or "stage" where day selection happens.
  // A language selection (external to this logic's direct handling for now) would make 'day_selection_stage' active.
  day_selection_stage: { 
    // parent: null, // Or a conceptual 'language_confirmed_stage' if needed
    children: ['day_single_input', 'day_range_input', 'day_confirm_action'],
    isExclusiveDaySelectorContainer: true, 
  },
  day_single_input: { 
    parent: 'day_selection_stage',
    isExclusiveDaySelector: true, 
  },
  day_range_input: { 
    parent: 'day_selection_stage',
    isExclusiveDaySelector: true,
  },
  day_confirm_action: { // Conceptual "action" key triggered by UI after day inputs are satisfactory
    parent: 'day_selection_stage', 
    children: ['main_practice_categories_stage'] 
  },

  // Stage: Main Practice Categories
  main_practice_categories_stage: {
    parent: 'day_confirm_action',
    children: ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing', 'practice_all_main_cat'],
  },
  vocabulary: {
    parent: 'main_practice_categories_stage',
    children: ['vocab_random_word', 'vocab_random_image', 'vocab_type_opposite', 'vocab_transcribe', 'vocab_build_word', 'vocab_practice_all_sub'],
  },
  grammar: {
    parent: 'main_practice_categories_stage',
    children: ['grammar_fill_gaps', 'grammar_type_verb' /* Add other grammar sub-options here */],
  },
  listening: { 
    parent: 'main_practice_categories_stage',
    // children: ['listening_sub_option1', ...] 
  },
  speaking: {
    parent: 'main_practice_categories_stage',
    // children: [...]
  },
  reading: {
    parent: 'main_practice_categories_stage',
    // children: [...]
  },
  writing: { 
    parent: 'main_practice_categories_stage',
    // children: [...]
  },
  practice_all_main_cat: { 
    parent: 'main_practice_categories_stage', 
  },

  // Sub-options for Vocabulary
  vocab_random_word: {
    parent: 'vocabulary',
    children: ['rw_show_word_mode', 'rw_guess_it_mode', 'rw_opposites_mode'], 
  },
  vocab_random_image: { parent: 'vocabulary' },
  vocab_type_opposite: { parent: 'vocabulary' },
  vocab_transcribe: { parent: 'vocabulary' },
  vocab_build_word: { parent: 'vocabulary' },
  vocab_practice_all_sub: { parent: 'vocabulary' },

  // Sub-sub-options for Vocabulary > Random Word
  rw_show_word_mode: { parent: 'vocab_random_word' },
  rw_guess_it_mode: { parent: 'vocab_random_word' },
  rw_opposites_mode: { parent: 'vocab_random_word' },
  
  // Sub-options for Grammar
  grammar_fill_gaps: { parent: 'grammar' },
  grammar_type_verb: { parent: 'grammar' },
  // ... other grammar sub-options and their potential children
};

// Note: The actual menuConfig will need to be more comprehensive and match
// the exact keys/identifiers used by the React components for their menu items/buttons.
// The `parent` property is vital for the logic in this file to correctly build paths.
// The FreestylePage or individual menu components would call these functions.
// For example, a DaySelector component, upon confirming days, might call:
//   const newMenuState = handleMenuSelection(currentMenuState.activePath, 'day_confirm_button', actualMenuConfig);
//   setCurrentMenuState(newMenuState);
// And then a VocabularyCategoryButton component would render itself based on:
//   isVisible = isMenuItemVisible(currentMenuState.activePath, 'vocabulary', actualMenuConfig);

```
