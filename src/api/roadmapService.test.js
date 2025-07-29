import { fetchRoadmapFromGitHub } from './roadmapService';

// Mocking global fetch
global.fetch = jest.fn();

describe('roadmapService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchRoadmapFromGitHub', () => {
    it('should fetch and parse roadmap data successfully', async () => {
      const mockRoadmapFileName = 'test.json';
      const mockRoadmapContent = { language_name: 'TestLang', levels: [] };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRoadmapContent,
      });

      const data = await fetchRoadmapFromGitHub(mockRoadmapFileName);

      const expectedUrl = `${process.env.PUBLIC_URL}/data/roadmaps/${mockRoadmapFileName}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(data).toEqual(mockRoadmapContent);
    });

    it('should throw an error if roadmapFileName is not provided', async () => {
      await expect(fetchRoadmapFromGitHub('')).rejects.toThrow('Roadmap file name must be provided.');
      await expect(fetchRoadmapFromGitHub(null)).rejects.toThrow('Roadmap file name must be provided.');
    });

    it('should throw an error if API request fails (response not ok)', async () => {
      const mockRoadmapFileName = 'fail.json';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'File not found' }),
      });

      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow(/API error: 404 - File not found/);
    });

    it('should throw an error if JSON parsing fails', async () => {
      const mockRoadmapFileName = 'bad_json.json';
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('JSON.parse: unexpected character at line 1 column 1 of the JSON data');
        },
      });

      await expect(fetchRoadmapFromGitHub(mockRoadmapFileName)).rejects.toThrow(); // Or more specific JSON parse error
    });
  });
});
