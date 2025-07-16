import { renderHook, waitFor } from '@testing-library/react';
import useVerbs from './useVerbs';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          category: 'regular',
          verbs: [
            {
              base: 'walk',
              pastSimple: 'walked',
              pastParticiple: 'walked',
              translation: 'to walk',
              verb_group: 'regular',
            },
          ],
        },
        {
          category: 'irregular',
          verbs: [
            {
              base: 'be',
              pastSimple: 'was/were',
              pastParticiple: 'been',
              translation: 'to be (exist, occur)',
              verb_group: 'irregular',
            },
            {
              base: 'go',
              pastSimple: 'went',
              pastParticiple: 'gone',
              translation: 'to go',
              verb_group: 'irregular',
            },
          ],
        },
      ]),
  })
);

describe('useVerbs', () => {
  it('should fetch and return all verbs when no levels are provided', async () => {
    const { result } = renderHook(() => useVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  it('should filter verbs by verb_group', async () => {
    const { result } = renderHook(() => useVerbs('regular', 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(1);
    expect(result.current.verbs[0].base).toBe('walk');
  });

  it('should return an error when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
      })
    );

    const { result } = renderHook(() => useVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(0);
    expect(result.current.error).not.toBe(null);
  });
});
