import React from 'react';
import { render, screen, fireEvent } from '../../testUtils';
import '@testing-library/jest-dom';
import ShadowingExercise from './ShadowingExercise';

// Mock the react-speech-recognition library
jest.mock('react-speech-recognition', () => ({
    ...jest.requireActual('react-speech-recognition'),
    useSpeechRecognition: () => ({
        transcript: 'This is a test transcript',
        listening: false,
        resetTranscript: jest.fn(),
        browserSupportsSpeechRecognition: true,
    }),
}));

describe('ShadowingExercise', () => {
    it('renders the component', () => {
        render(<ShadowingExercise audioSrc="" transcript="This is a test transcript" />);
        expect(screen.getByText('Shadowing Exercise')).toBeInTheDocument();
    });

    it('displays the original transcript', () => {
        render(<ShadowingExercise audioSrc="" transcript="This is a test transcript" />);
        expect(screen.getByText('This is a test transcript')).toBeInTheDocument();
    });

    it('displays the user transcript', () => {
        render(<ShadowingExercise audioSrc="" transcript="This is a test transcript" />);
        expect(screen.getByText('Your Transcript:')).toBeInTheDocument();
    });
});
