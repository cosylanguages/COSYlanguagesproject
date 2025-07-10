import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FillInTheBlanksPracticeHost from './FillInTheBlanksPracticeHost';
import { I18nProvider } from '../../../../i18n/I18nContext';
import { LatinizationProvider } from '../../../../contexts/LatinizationContext';
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

const mockT = jest.fn((key, defaultValueOrOptions) => {
    let effectiveDefault = key;
    if (typeof defaultValueOrOptions === 'string') {
        effectiveDefault = defaultValueOrOptions;
    } else if (defaultValueOrOptions && typeof defaultValueOrOptions === 'object' && defaultValueOrOptions.defaultValue) {
        effectiveDefault = defaultValueOrOptions.defaultValue;
    }
    return effectiveDefault;
});


const mockExercises = [
  { id: 'fitb1', sentenceParts: ["Part 1 ", null], answers: ["Ans1"] },
  { id: 'fitb2', sentenceParts: ["Another ", null, " example"], answers: ["Test"] },
];
const mockSingleExercise = [{ id: 'single1', sentenceParts: ["Only ", null, " one"], answers: ["exercise"] }];


const renderHost = (props) => {
  return render(
    <I18nProvider i18n={{ t: mockT, language: 'COSYenglish', currentLangKey: 'COSYenglish' }}>
      <LatinizationProvider>
        <FillInTheBlanksPracticeHost language="COSYenglish" exerciseKey="1" {...props} />
      </LatinizationProvider>
    </I18nProvider>
  );
};

describe('FillInTheBlanksPracticeHost', () => {
  beforeEach(() => {
    mockT.mockClear();
    exerciseDataService.loadFillInTheBlanksData.mockClear();
  });

  it('renders loading state initially', () => {
    exerciseDataService.loadFillInTheBlanksData.mockReturnValue(new Promise(() => {}));
    renderHost();
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
  });

  it('renders error message if data loading fails', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: null, error: 'Failed to load exercises.' });
    renderHost();
    expect(await screen.findByText(/Failed to load exercises./)).toBeInTheDocument();
  });

  it('renders "no exercises" message if data is empty', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [], error: null });
    renderHost();
    expect(await screen.findByText(/No Fill in the Blanks exercises found for this language./)).toBeInTheDocument();
  });

  it('loads and displays the first exercise (could be either due to shuffle)', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockExercises], error: null });
    renderHost();
    expect(await screen.findByTestId('fill-in-blanks-exercise-mock')).toBeInTheDocument();
    const exerciseIdElement = await screen.findByText(/Exercise ID: (fitb1|fitb2)/);
    expect(exerciseIdElement).toBeInTheDocument();
  });

  it('navigates to the next exercise when "Next Exercise" is clicked after a correct answer', async () => {
    // To make this test deterministic, mock shuffle or provide data in specific order
    // For now, let's ensure loadFillInTheBlanksData returns a fresh copy for each test run if needed
    const initialExercises = [...mockExercises]; // Make a copy
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: initialExercises, error: null });
    renderHost();

    const firstExercise = await screen.findByText(/Exercise ID: (fitb1|fitb2)/);
    const firstId = firstExercise.textContent.includes('fitb1') ? 'fitb1' : 'fitb2';
    const secondId = firstId === 'fitb1' ? 'fitb2' : 'fitb1';

    fireEvent.click(screen.getByText('CorrectBTN'));
    expect(await screen.findByText('Correct!')).toBeInTheDocument();

    // Find button by role and partial name, as it contains an arrow
    fireEvent.click(screen.getByRole('button', { name: /Next Exercise/i }));

    await waitFor(() => {
        expect(screen.getByText(`Exercise ID: ${secondId}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
  });

  it('restarts exercises if "Next Exercise" is clicked at the end of the list', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockSingleExercise], error: null });
    renderHost();

    await screen.findByTestId('fill-in-blanks-exercise-mock');
    fireEvent.click(screen.getByText('CorrectBTN'));
    expect(await screen.findByText('Correct!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next Exercise/i }));

    expect(await screen.findByText(/All blanks filled! Resetting.../)).toBeInTheDocument();
    await waitFor(() => {
      // Due to shuffling on restart, we just check if an exercise ID is present
      expect(screen.getByText(/Exercise ID: single1/)).toBeInTheDocument();
    });
  });

  it('clears feedback on new attempt', async () => {
    exerciseDataService.loadFillInTheBlanksData.mockResolvedValue({ data: [...mockExercises], error: null });
    renderHost();
    await screen.findByTestId('fill-in-blanks-exercise-mock');

    fireEvent.click(screen.getByText('IncorrectBTN'));
    expect(await screen.findByText(/Not quite, try again or reveal./)).toBeInTheDocument();

    fireEvent.click(screen.getByText('AttemptBTN'));
    expect(screen.queryByText(/Not quite, try again or reveal./)).not.toBeInTheDocument();
  });

});
