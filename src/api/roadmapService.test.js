import { fetchRoadmapFromGitHub } from './roadmapService';

// Mocking global fetch
global.fetch = jest.fn();

// Mocking atob and Buffer for Node.js environment (Jest)
// In a browser environment, atob would exist on window.
// In Node.js, Buffer is available.
global.atob = global.atob || ((b64Encoded) => Buffer.from(b64Encoded, 'base64').toString());
// Buffer is typically global in Node.js, but ensure it's understood for the test.
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}


const REPO_OWNER = 'cosylanguages';
const REPO_NAME = 'COSYlanguagesproject';
const GITHUB_API_BASE_URL = 'https://api.github.com';

describe('roadmapService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchRoadmapFromGitHub', () => {
    it('should fetch, decode, and parse roadmap data successfully', async () => {
      const mockRoadmapFileName = 'test_roadmap.json';
      const mockRoadmapContent = { language_name: 'TestLang', levels: [] };
      const base64Content = Buffer.from(JSON.stringify(mockRoadmapContent)).toString('base64');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: base64Content,
          encoding: 'base64',
        }),
      });

      const data = await fetchRoadmapFromGitHub(mockRoadmapFileName);

      const expectedUrl = `${GITHUB_API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${mockRoadmapFileName}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: { 'Accept': 'application/vnd.github.object' },
      });
      expect(data).toEqual(mockRoadmapContent);
    });

    it('should throw an error if roadmapFileName is not provided', async () => {
      await expect(fetchRoadmapFromGitHub('')).rejects.toThrow('Roadmap file name must be provided.');
      await expect(fetchRoadmapFromGitHub(null)).rejects.toThrow('Roadmap file name must be provided.');
    });

    it('should throw an error if GitHub API request fails (response not ok)', async () => {
      const mockRoadmapFileName = 'fail_roadmap.json';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'File not found' }),
      });

      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow(/GitHub API error: 404 - File not found/);
    });

    it('should throw an error if content encoding is not base64', async () => {
      const mockRoadmapFileName = 'encoding_error_roadmap.json';
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'some content',
          encoding: 'utf-8', // Incorrect encoding
        }),
      });

      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow('Unexpected content encoding from GitHub API: utf-8');
    });

    it('should throw an error if content is missing in response', async () => {
      const mockRoadmapFileName = 'no_content_roadmap.json';
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          // No content field
          encoding: 'base64',
        }),
      });
      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow('No content found in GitHub API response for the file.');
    });


    it('should throw an error if JSON parsing fails', async () => {
      const mockRoadmapFileName = 'bad_json_roadmap.json';
      const base64Content = Buffer.from("this is not json").toString('base64');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: base64Content,
          encoding: 'base64',
        }),
      });

      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow(); // Or more specific JSON parse error
    });

    // Test for atob fallback if Buffer is not available (harder to simulate reliably without specific environment setup)
    // For now, we assume one of them is available.
  });
});
