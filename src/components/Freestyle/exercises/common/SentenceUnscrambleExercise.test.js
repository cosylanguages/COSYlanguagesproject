import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentenceUnscrambleExercise from './SentenceUnscrambleExercise';
import { I18nProvider } from '../../../../i18n/I18nContext';
import { LatinizationProvider } from '../../../../contexts/LatinizationContext';

const mockT = jest.fn((key, fallbackOrParams) => {
  if (typeof fallbackOrParams === 'string') return fallbackOrParams;
  if (fallbackOrParams && typeof fallbackOrParams === 'object' && fallbackOrParams.defaultValue) return fallbackOrParams.defaultValue;
  return key;
});

const mockExerciseData = {
  id: 'test-su-1',
  type: 'sentence-unscramble',
  languageCode: 'COSYenglish',
  correctSentence: 'This is a test sentence.',
  scrambledWords: ['sentence.', 'a', 'is', 'This', 'test'],
  translation: 'A translation.',
  hint: 'A hint.',
};

const mockExerciseDataNoScramble = {
  id: 'test-su-2',
  type: 'sentence-unscramble',
  languageCode: 'COSYenglish',
  correctSentence: 'One word.',
  // scrambledWords: null, // Will be auto-generated
  translation: 'A translation.',
  hint: 'A hint.',
};


const renderExercise = (props) => {
  return render(
    <I18nProvider i18n={{ t: mockT, language: 'COSYenglish' }}>
      <LatinizationProvider>
        <SentenceUnscrambleExercise {...props} />
      </LatinizationProvider>
    </I18nProvider>
  );
};

describe('SentenceUnscrambleExercise', () => {
  beforeEach(() => {
    mockT.mockClear();
  });

  it('renders correctly with initial data', () => {
    renderExercise({ exerciseData: mockExerciseData });
    expect(screen.getByText('Unscramble the Sentence')).toBeInTheDocument();
    expect(screen.getByText(/Meaning: A translation./)).toBeInTheDocument();
    expect(screen.getByText(/Hint: A hint./)).toBeInTheDocument();
    mockExerciseData.scrambledWords.forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
  });

  it('scrambles words if not provided in exerciseData', () => {
    renderExercise({ exerciseData: { ...mockExerciseData, scrambledWords: null, correctSentence: "Short test."} });
    // Check that "Short" and "test." are present as scrambled words
    expect(screen.getByText("Short")).toBeInTheDocument();
    expect(screen.getByText("test.")).toBeInTheDocument();
  });

  it('handles single word "sentence" correctly by not over-shuffling', () => {
    renderExercise({ exerciseData: mockExerciseDataNoScramble });
    expect(screen.getByText("One")).toBeInTheDocument(); // Should be only "One" if "word." is punctuation only part
    expect(screen.getByText("word.")).toBeInTheDocument();
    // Check that it doesn't get stuck in shuffle loop for single word
    // (Implicitly tested by rendering)
  });


  it('allows clicking scrambled words to move them to user sentence area', () => {
    renderExercise({ exerciseData: mockExerciseData });
    fireEvent.click(screen.getByText('This'));
    const userSentenceArea = screen.getByText('This').closest('.user-sentence-area');
    expect(userSentenceArea).toBeInTheDocument();
    expect(screen.queryByText('Click words below to build the sentence here...')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('is'));
    expect(userSentenceArea.textContent).toContain('Thisis'); // Basic check, could be more specific
  });

  it('allows clicking user words to move them back to scrambled area', () => {
    renderExercise({ exerciseData: mockExerciseData });
    fireEvent.click(screen.getByText('This')); // Move "This" to user area
    let userWordButton = screen.getByText('This', { selector: 'button.user-word' });
    fireEvent.click(userWordButton); // Click "This" in user area

    // "This" should be back in scrambled area
    const scrambledArea = screen.getByText('This').closest('.scrambled-words-area');
    expect(scrambledArea).toBeInTheDocument();
    // User area should be empty or show placeholder
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
  });

  it('checks answer correctly and shows feedback', () => {
    const onCorrectMock = jest.fn();
    const onIncorrectMock = jest.fn();
    renderExercise({ exerciseData: mockExerciseData, onCorrect: onCorrectMock, onIncorrect: onIncorrectMock });

    // Click words in correct order
    fireEvent.click(screen.getByText('This'));
    fireEvent.click(screen.getByText('is'));
    fireEvent.click(screen.getByText('a'));
    fireEvent.click(screen.getByText('test'));
    fireEvent.click(screen.getByText('sentence.'));

    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(onCorrectMock).toHaveBeenCalled();
    expect(onIncorrectMock).not.toHaveBeenCalled();
  });

  it('checks incorrect answer and shows feedback', () => {
    const onCorrectMock = jest.fn();
    const onIncorrectMock = jest.fn();
    renderExercise({ exerciseData: mockExerciseData, onCorrect: onCorrectMock, onIncorrect: onIncorrectMock });

    // Click words in incorrect order
    fireEvent.click(screen.getByText('a'));
    fireEvent.click(screen.getByText('This'));

    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Incorrect, try again.')).toBeInTheDocument();
    expect(onIncorrectMock).toHaveBeenCalled();
    expect(onCorrectMock).not.toHaveBeenCalled();
  });

  it('resets the attempt', () => {
    renderExercise({ exerciseData: mockExerciseData });
    fireEvent.click(screen.getByText('This')); // move one word
    expect(screen.getByText('This', { selector: 'button.user-word' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    // All original scrambled words should be back
    mockExerciseData.scrambledWords.forEach(word => {
      expect(screen.getByText(word, { selector: 'button.scrambled-word'})).toBeInTheDocument();
    });
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect, try again.')).not.toBeInTheDocument();
  });
});
