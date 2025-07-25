/**
 * Fetches a language roadmap.
 * @param {string} languageCode - The code of the language to fetch the roadmap for.
 * @returns {Promise<object>} A promise that resolves to the roadmap data.
 */
export async function fetchRoadmap(languageCode) {
  if (!languageCode) {
    throw new Error("Language code must be provided.");
  }

  const url = `/data/roadmaps/${languageCode}/roadmap.json`;
  console.log(`Fetching roadmap from: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching roadmap for "${languageCode}":`, error);
    throw error;
  }
}

/**
 * Fetches a specific level from a language roadmap.
 * @param {string} languageCode - The code of the language.
 * @param {string} levelCode - The code of the level to fetch.
 * @returns {Promise<object>} A promise that resolves to the level data.
 */
export async function fetchLevel(languageCode, levelCode) {
  if (!languageCode || !levelCode) {
    throw new Error("Language code and level code must be provided.");
  }

  const url = `/data/roadmaps/${languageCode}/${levelCode}.json`;
  console.log(`Fetching level from: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching level "${levelCode}" for language "${languageCode}":`, error);
    throw error;
  }
}
