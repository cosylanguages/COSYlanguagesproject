import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WritingQuestionExercise from './WritingQuestionExercise';

// Mock the WritingHelper component
jest.mock('../../../StudyMode/WritingHelper', () => {
    return function DummyWritingHelper({ onTextChange }) {
        return <textarea data-testid="writing-helper" onChange={(e) => onTextChange(e.target.value)}></textarea>;
    };
});

describe('WritingQuestionExercise', () => {
    it('renders the WritingHelper component', () => {
        render(<WritingQuestionExercise language="en" days={['1']} />);
        expect(screen.getByTestId('writing-helper')).toBeInTheDocument();
    });
});
