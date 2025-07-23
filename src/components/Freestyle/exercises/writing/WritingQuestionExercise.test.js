import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WritingQuestionExercise from './WritingQuestionExercise';
import { LatinizationProvider } from '../../../../contexts/LatinizationContext';

// Mock the WritingHelper component
jest.mock('../../../StudyMode/WritingHelper', () => {
    return function DummyWritingHelper({ onTextChange }) {
        return <textarea data-testid="writing-helper" onChange={(e) => onTextChange(e.target.value)}></textarea>;
    };
});

describe('WritingQuestionExercise', () => {
    it('renders the WritingHelper component', () => {
        render(
            <I18nProvider>
            <LatinizationProvider>
                <WritingQuestionExercise language="en" days={['1']} />
            </LatinizationProvider>
            </I18nProvider>
        );
        expect(screen.getByTestId('writing-helper')).toBeInTheDocument();
    });
});
