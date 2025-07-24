import React from 'react';
import { render, screen, fireEvent } from '../../../../testUtils';
import '@testing-library/jest-dom';
import SentenceUnscrambleExercise from './SentenceUnscrambleExercise';

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
  translation: 'A translation.',
  hint: 'A hint.',
};

describe('SentenceUnscrambleExercise', () => {
  it('renders correctly with initial data', () => {
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} />);
    expect(screen.getByText('Unscramble the Sentence')).toBeInTheDocument();
    expect(screen.getByText(/Meaning: A translation./)).toBeInTheDocument();
    expect(screen.getByText(/Hint: A hint./)).toBeInTheDocument();
    mockExerciseData.scrambledWords.forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
  });

  it('scrambles words if not provided in exerciseData', () => {
    render(<SentenceUnscrambleExercise exerciseData={{ ...mockExerciseData, scrambledWords: null, correctSentence: "Short test."}} />);
    expect(screen.getByText("Short")).toBeInTheDocument();
    expect(screen.getByText("test.")).toBeInTheDocument();
  });

  it('handles single word "sentence" correctly by not over-shuffling', () => {
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseDataNoScramble} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("word.")).toBeInTheDocument();
  });

  it('allows clicking scrambled words to move them to user sentence area', () => {
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} />);
    fireEvent.click(screen.getByText('This'));
    const userSentenceArea = screen.getByText('This').closest('.user-sentence-area');
    expect(userSentenceArea).toBeInTheDocument();
    expect(screen.queryByText('Click words below to build the sentence here...')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('is'));
    expect(userSentenceArea.textContent).toContain('Thisis');
  });

  it('allows clicking user words to move them back to scrambled area', () => {
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} />);
    fireEvent.click(screen.getByText('This'));
    let userWordButton = screen.getByText('This', { selector: 'button.user-word' });
    fireEvent.click(userWordButton);
    const scrambledArea = screen.getByText('This').closest('.scrambled-words-area');
    expect(scrambledArea).toBeInTheDocument();
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
  });

  it('checks answer correctly and shows feedback', () => {
    const onCorrectMock = jest.fn();
    const onIncorrectMock = jest.fn();
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} onCorrect={onCorrectMock} onIncorrect={onIncorrectMock} />);
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
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} onCorrect={onCorrectMock} onIncorrect={onIncorrectMock} />);
    fireEvent.click(screen.getByText('a'));
    fireEvent.click(screen.getByText('This'));
    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Incorrect, try again.')).toBeInTheDocument();
    expect(onIncorrectMock).toHaveBeenCalled();
    expect(onCorrectMock).not.toHaveBeenCalled();
  });

  it('resets the attempt', () => {
    render(<SentenceUnscrambleExercise exerciseData={mockExerciseData} />);
    fireEvent.click(screen.getByText('This'));
    expect(screen.getByText('This', { selector: 'button.user-word' })).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try Again'));
    mockExerciseData.scrambledWords.forEach(word => {
      expect(screen.getByText(word, { selector: 'button.scrambled-word'})).toBeInTheDocument();
    });
    expect(screen.getByText('Click words below to build the sentence here...')).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect, try again.')).not.toBeInTheDocument();
  });
});
