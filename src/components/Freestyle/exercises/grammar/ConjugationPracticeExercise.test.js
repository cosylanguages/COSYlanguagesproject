import React from 'react';
import { render, screen, waitFor } from '../../../../testUtils';
import '@testing-library/jest-dom';
import ConjugationPracticeExercise from './ConjugationPracticeExercise';
import * as conjugationDataService from '../../../../utils/conjugationDataService';

jest.mock('../../../../utils/conjugationDataService');
jest.mock('./FillConjugationTable', () => () => <div data-testid="fill-table-mock">FillConjugationTableMock</div>);
jest.mock('./VerbFormTranslation', () => () => <div data-testid="verb-translation-mock">VerbFormTranslationMock</div>);
jest.mock('./IrregularVerbQuiz', () => () => <div data-testid="irregular-quiz-mock">IrregularVerbQuizMock</div>);

describe('ConjugationPracticeExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    conjugationDataService.loadConjugationData.mockResolvedValue({ data: { verbs: [{ infinitive: 'être', tenses: { présent: { forms: { je: 'suis' } } } }] }, error: null });
    conjugationDataService.loadEnglishIrregularVerbsData.mockResolvedValue({ data: [{ base: 'be', pastSimple: 'was', pastParticiple: 'been' }], error: null });
  });

  test('renders loading state initially', () => {
    render(<ConjugationPracticeExercise language="COSYfrench" exerciseKey="1" />);
    expect(screen.getByText('Loading conjugation exercise...')).toBeInTheDocument();
  });

  test('renders error message if language is not provided', async () => {
    render(<ConjugationPracticeExercise language={null} />);
    expect(await screen.findByText(/Please select a language./)).toBeInTheDocument();
  });

  test('renders error message if fetching conjugation data fails', async () => {
    conjugationDataService.loadConjugationData.mockRejectedValueOnce(new Error('Failed to load data'));
    render(<ConjugationPracticeExercise language="COSYfrench" />);
    expect(await screen.findByText(/Failed to load data/)).toBeInTheDocument();
  });

  test('renders "no conjugation data" message if data is empty', async () => {
    conjugationDataService.loadConjugationData.mockResolvedValueOnce({ data: { verbs: [] }, error: null });
    render(<ConjugationPracticeExercise language="COSYfrench" />);
    expect(await screen.findByText(/No conjugation data found for this language./)).toBeInTheDocument();
  });

  test('loads and displays one of the exercise components', async () => {
    const mockVerb = {
      infinitive: 'chanter',
      tenses: {
        présent: { forms: { je: 'chante', tu: 'chantes' } },
        'futur simple': { forms: { je: 'chanterai' } }
      }
    };
    conjugationDataService.loadConjugationData.mockResolvedValue({ data: { verbs: [mockVerb] }, error: null });
    render(<ConjugationPracticeExercise language="COSYfrench" />);
    await waitFor(() => {
      const fillTable = screen.queryByTestId('fill-table-mock');
      const verbTranslation = screen.queryByTestId('verb-translation-mock');
      const irregularQuiz = screen.queryByTestId('irregular-quiz-mock');
      expect(fillTable || verbTranslation || irregularQuiz).toBeInTheDocument();
    });
  });
});
