const GITHUB_API_BASE_URL = 'https://api.github.com';
// Assuming the current repository details based on previous step
const REPO_OWNER = 'cosylanguages';
const REPO_NAME = 'COSYlanguagesproject';

/**
 * Fetches a specific language roadmap JSON file from the GitHub repository.
 * @param {string} roadmapFileName - The name of the roadmap file (e.g., "armenian_roadmap.json").
 * @returns {Promise<object>} A promise that resolves to the roadmap data (parsed JSON).
 * @throws {Error} If fetching or parsing the data fails.
 */
export async function fetchRoadmapFromGitHub(roadmapFileName) {
  if (!roadmapFileName) {
    throw new Error("Roadmap file name must be provided.");
  }

  const filePath = roadmapFileName; // Assuming files are in the root
  const url = `${GITHUB_API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  console.log(`Fetching roadmap from GitHub: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        // 'Accept': 'application/vnd.github.v3+json', // Standard
        'Accept': 'application/vnd.github.object', // To get raw content directly if possible, or ensure correct type for content
        // No 'Authorization' header for public repos, to avoid needing a token client-side.
        // If private repo or to avoid rate limits, token would be needed (and handled securely).
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Failed to fetch roadmap content.'} (URL: ${url})`);
    }

    const data = await response.json();

    if (data.encoding !== 'base64') {
      throw new Error(`Unexpected content encoding from GitHub API: ${data.encoding}`);
    }
    if (!data.content) {
        throw new Error('No content found in GitHub API response for the file.');
    }

    // Decode base64 content
    // In modern browsers, atob is available. For Node.js environment (like Jest), it might need a polyfill or Buffer.
    let decodedContent;
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      decodedContent = window.atob(data.content);
    } else if (typeof Buffer !== 'undefined') {
      decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    } else {
      throw new Error('Unable to decode base64 content: No atob or Buffer available.');
    }

    return JSON.parse(decodedContent);

  } catch (error) {
    console.error(`Error fetching roadmap "${roadmapFileName}" from GitHub:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}
