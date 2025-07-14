import { renderHook, waitFor } from '@testing-library/react';
import useIrregularVerbs from './useIrregularVerbs';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          infinitive: 'be',
          past_simple: 'was/were',
          past_participle: 'been',
          definition: 'To exist or live.',
          example: 'I want to be a doctor.',
          level: 'A1',
        },
        {
          infinitive: 'go',
          past_simple: 'went',
          past_participle: 'gone',
          definition: 'To move from one place to another.',
          example: 'I go to school by bus.',
          level: 'A1',
        },
        {
          infinitive: 'eat',
          past_simple: 'ate',
          past_participle: 'eaten',
          definition: 'To put food into the mouth and chew and swallow it.',
          example: 'I like to eat apples.',
          level: 'A2',
        },
      ]),
  })
);

describe('useIrregularVerbs', () => {
  it('should fetch and return all verbs when no levels are provided', async () => {
    const { result } = renderHook(() => useIrregularVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  it('should filter verbs by level', async () => {
    const { result } = renderHook(() => useIrregularVerbs('A1', 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(2);
    expect(result.current.verbs[0].infinitive).toBe('be');
    expect(result.current.verbs[1].infinitive).toBe('go');
  });

  it('should filter verbs by multiple levels', async () => {
    const { result } = renderHook(() => useIrregularVerbs('A1,A2', 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(3);
  });

  it('should return an error when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
      })
    );

    const { result } = renderHook(() => useIrregularVerbs(null, 'en'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.verbs).toHaveLength(0);
    expect(result.current.error).not.toBe(null);
  });
});
