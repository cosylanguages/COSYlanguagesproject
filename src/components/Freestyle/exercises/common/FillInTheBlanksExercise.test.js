import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FillInTheBlanksExercise from './FillInTheBlanksExercise';
import { I18nProvider } from '../../../../i18n/I18nContext';

const mockT = jest.fn((key, defaultValueOrOptions) => {
  if (typeof defaultValueOrOptions === 'string') return defaultValueOrOptions;
  if (defaultValueOrOptions && defaultValueOrOptions.defaultValue) return defaultValueOrOptions.defaultValue;
  return key;
});

const mockExerciseData = {
  id: 'fitb1',
  type: 'fill-in-the-blanks',
  languageCode: 'COSYenglish',
  sentenceParts: ["The quick brown ", null, " jumps over the ", null, " dog."],
  answers: ["fox", "lazy"],
  correctSentence: "The quick brown fox jumps over the lazy dog.",
  translation: "A pangram.",
  hint: "Animal and an adjective."
};

const renderExercise = (props) => {
  return render(
    <I18nProvider i18n={{ t: mockT, language: 'COSYenglish' }}>
      <FillInTheBlanksExercise exerciseData={mockExerciseData} {...props} />
    </I18nProvider>
  );
};

describe('FillInTheBlanksExercise', () => {
  let onCorrectMock, onIncorrectMock, onAttemptMock;

  beforeEach(() => {
    mockT.mockClear();
    onCorrectMock = jest.fn();
    onIncorrectMock = jest.fn();
    onAttemptMock = jest.fn();
  });

  it('renders correctly with initial data', () => {
    renderExercise();
    expect(screen.getByText('Fill in the Blanks')).toBeInTheDocument();
    expect(screen.getByText(/Meaning: A pangram./)).toBeInTheDocument();
    expect(screen.getByText(/Hint: Animal and an adjective./)).toBeInTheDocument();

    expect(screen.getByText('The quick brown')).toBeInTheDocument();
    expect(screen.getByText('jumps over the')).toBeInTheDocument();
    expect(screen.getByText('dog.')).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(2);
    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveValue('');
  });

  it('updates user answers on input change', () => {
    renderExercise();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'cat' } });
    expect(inputs[0]).toHaveValue('cat');
  });

  it('checks correct answers and calls onCorrect', () => {
    renderExercise({ onCorrect: onCorrectMock, onIncorrect: onIncorrectMock, onAttempt: onAttemptMock });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'fox' } });
    fireEvent.change(inputs[1], { target: { value: 'lazy' } });

    fireEvent.click(screen.getByText('Check Answer'));

    expect(onAttemptMock).toHaveBeenCalled();
    expect(onCorrectMock).toHaveBeenCalled();
    expect(onIncorrectMock).not.toHaveBeenCalled();
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('checks incorrect answers and calls onIncorrect', () => {
    renderExercise({ onCorrect: onCorrectMock, onIncorrect: onIncorrectMock, onAttempt: onAttemptMock });
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'dog' } }); // incorrect
    fireEvent.change(inputs[1], { target: { value: 'quick' } }); // incorrect

    fireEvent.click(screen.getByText('Check Answer'));

    expect(onAttemptMock).toHaveBeenCalled();
    expect(onIncorrectMock).toHaveBeenCalled();
    expect(onCorrectMock).not.toHaveBeenCalled();
    expect(screen.getByText('Incorrect, try again.')).toBeInTheDocument();
  });

  it('reveals answers when "Reveal Answers" is clicked', () => {
    renderExercise();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).not.toBeDisabled();

    fireEvent.click(screen.getByText('Reveal Answers'));

    expect(inputs[0]).toHaveValue('fox');
    expect(inputs[1]).toHaveValue('lazy');
    expect(inputs[0]).toBeDisabled(); // Inputs should be disabled after reveal
    expect(inputs[1]).toBeDisabled();
    expect(screen.getByText('Answers are shown above.')).toBeInTheDocument();
  });

  it('resets the exercise when "Try Again" is clicked', () => {
    renderExercise();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'test' } });
    fireEvent.click(screen.getByText('Check Answer')); // Mark as incorrect
    expect(screen.getByText('Incorrect, try again.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveValue('');
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect, try again.')).not.toBeInTheDocument();
    expect(inputs[0]).not.toBeDisabled();
  });

});
