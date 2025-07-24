import { renderHook, waitFor } from '../../testUtils';
import useVerbs from './useVerbs';

global.fetch = jest.fn();

describe('useVerbs', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return all verbs when no levels are provided', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { category: 'regular', verbs: [{ base: 'walk' }] },
        { category: 'irregular', verbs: [{ base: 'be' }, { base: 'go' }] },
      ]),
    });

    const { result } = renderHook(() => useVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  it('should filter verbs by verb_group', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { category: 'regular', verbs: [{ base: 'walk', verb_group: 'regular' }] },
        { category: 'irregular', verbs: [{ base: 'be', verb_group: 'irregular' }] },
      ]),
    });

    const { result } = renderHook(() => useVerbs('regular', 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(1);
    expect(result.current.verbs[0].base).toBe('walk');
  });

  it('should return an error when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(0);
    expect(result.current.error).not.toBe(null);
  });
});
