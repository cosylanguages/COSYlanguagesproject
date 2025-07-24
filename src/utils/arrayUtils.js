/**
 * Shuffles an array in place and returns a new shuffled array.
 * This is a pure function that does not modify the original array.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new array with the elements randomly shuffled.
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Selects a random item from an array of items, where each item has a weight.
 * @param {Array<{item: any, weight: number}>} itemsWithWeights - An array of objects,
 * each with an 'item' and its 'weight'.
 * @returns {any|null} The selected item, or null if the input is invalid or empty.
 */
export function getWeightedRandomItem(itemsWithWeights) {
  if (!itemsWithWeights || itemsWithWeights.length === 0) {
    return null;
  }

  const totalWeight = itemsWithWeights.reduce((sum, entry) => sum + (entry.weight || 0), 0);
  if (totalWeight <= 0) {
    // If the total weight is 0 or less, fall back to a uniform random selection.
    const originalItems = itemsWithWeights.map(iw => iw.item);
    return originalItems.length > 0 ? originalItems[Math.floor(Math.random() * originalItems.length)] : null;
  }

  let randomValue = Math.random() * totalWeight;
  for (let i = 0; i < itemsWithWeights.length; i++) {
    if (randomValue < (itemsWithWeights[i].weight || 0)) {
      return itemsWithWeights[i].item;
    }
    randomValue -= (itemsWithWeights[i].weight || 0);
  }

  // Fallback in case of rounding errors or other unexpected scenarios.
  const originalItems = itemsWithWeights.map(iw => iw.item);
  return originalItems.length > 0 ? originalItems[Math.floor(Math.random() * originalItems.length)] : null;
}
