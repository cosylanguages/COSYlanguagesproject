import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../testUtils';
import '@testing-library/jest-dom';
import FillInTheBlanksPracticeHost from './FillInTheBlanksPracticeHost';
import * as exerciseDataService from '../../../../utils/exerciseDataService';

jest.mock('../../../../utils/exerciseDataService');
jest.mock('./FillInTheBlanksExercise', () => ({ exerciseData, onCorrect, onIncorrect, onAttempt }) => (
  <div data-testid="fill-in-blanks-exercise-mock">
    <p>Exercise ID: {exerciseData?.id}</p>
    <button onClick={onCorrect}>CorrectBTN</button>
    <button onClick={onIncorrect}>IncorrectBTN</button>
    <button onClick={onAttempt}>AttemptBTN</button>
  </div>
));

const mockExercises = [
  { id: 'fitb1', sentenceParts: ["Part 1 ", null], answers: ["Ans1"] },
  { id: 'fitb2', sentenceParts: ["Another ", null, " example"], answers: ["Test"] },
];
const mockSingleExercise = [{ id: 'single1', sentenceParts: ["Only ", null, " one"], answers: ["exercise"] }];

describe('FillInTheBlanksPracticeHost', () => {
  beforeEach(() => {
    exerciseDataService.loadFillInTheBlanksData.mockClear();
  });

  it('renders loading state initially', () => {
    exerciseDataService.loadFillInTheBlanksData.mockReturnValue(new Promise(() => {}));
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
  });

  it('renders error message if data loading fails', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: null, error: 'Failed to load exercises.' });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    expect(await screen.findByText(/Failed to load exercises./)).toBeInTheDocument();
  });

  it('renders "no exercises" message if data is empty', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [], error: null });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    expect(await screen.findByText(/No Fill in the Blanks exercises found for this language./)).toBeInTheDocument();
  });

  it('loads and displays the first exercise', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockExercises], error: null });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    expect(await screen.findByTestId('fill-in-blanks-exercise-mock')).toBeInTheDocument();
    const exerciseIdElement = await screen.findByText(/Exercise ID: (fitb1|fitb2)/);
    expect(exerciseIdElement).toBeInTheDocument();
  });

  it('navigates to the next exercise', async () => {
    const initialExercises = [...mockExercises];
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: initialExercises, error: null });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    const firstExercise = await screen.findByText(/Exercise ID: (fitb1|fitb2)/);
    const firstId = firstExercise.textContent.includes('fitb1') ? 'fitb1' : 'fitb2';
    const secondId = firstId === 'fitb1' ? 'fitb2' : 'fitb1';
    fireEvent.click(screen.getByText('CorrectBTN'));
    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Exercise/i }));
    await waitFor(() => {
        expect(screen.getByText(`Exercise ID: ${secondId}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
  });

  it('restarts exercises', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockSingleExercise], error: null });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    await screen.findByTestId('fill-in-blanks-exercise-mock');
    fireEvent.click(screen.getByText('CorrectBTN'));
    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Exercise/i }));
    expect(await screen.findByText(/All blanks filled! Resetting.../)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Exercise ID: single1/)).toBeInTheDocument();
    });
  });

  it('clears feedback on new attempt', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockExercises], error: null });
    render(<FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" />);
    await screen.findByTestId('fill-in-blanks-exercise-mock');
    fireEvent.click(screen.getByText('IncorrectBTN'));
    expect(await screen.findByText(/Not quite, try again or reveal./)).toBeInTheDocument();
    fireEvent.click(screen.getByText('AttemptBTN'));
    expect(screen.queryByText(/Not quite, try again or reveal./)).not.toBeInTheDocument();
  });
});
