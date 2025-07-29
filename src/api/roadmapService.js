/**
 * Fetches a language roadmap from the public data folder.
 * @param {string} roadmapFileName - The name of the roadmap file to fetch.
 * @returns {Promise<object>} A promise that resolves to the roadmap data.
 */
export async function fetchRoadmapFromGitHub(roadmapFileName) {
  if (!roadmapFileName) {
    throw new Error("Roadmap file name must be provided.");
  }

  const url = `${process.env.PUBLIC_URL}/data/roadmaps/${roadmapFileName}`;

  console.log(`Fetching roadmap from: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API error: ${response.status} - ${errorData.message || 'Failed to fetch roadmap content.'} (URL: ${url})`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Error fetching roadmap "${roadmapFileName}":`, error);
    throw error;
  }
}
