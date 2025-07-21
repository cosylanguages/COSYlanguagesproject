import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudySentenceUnscramble from './StudySentenceUnscramble';
import { loadSentenceUnscrambleData } from '../../../utils/exerciseDataService';

jest.mock('../../../utils/exerciseDataService');

describe('StudySentenceUnscramble', () => {
    it('renders the exercise when data is loaded successfully', async () => {
        loadSentenceUnscrambleData.mockResolvedValue({
            data: [{ id: 1, correctSentence: 'Hello world!' }],
            error: null
        });
        render(<StudySentenceUnscramble language="en" />);
        await waitFor(() => {
            expect(screen.getByText('Sentence Unscramble (Study Mode)')).toBeInTheDocument();
        });
    });

    it('displays an error message when data fails to load', async () => {
        loadSentenceUnscrambleData.mockResolvedValue({
            data: null,
            error: { message: 'Failed to load' }
        });
        render(<StudySentenceUnscramble language="en" />);
        await waitFor(() => {
            expect(screen.getByText('Error: Failed to load')).toBeInTheDocument();
        });
    });

    it('displays a message when no exercises are available', async () => {
        loadSentenceUnscrambleData.mockResolvedValue({
            data: [],
            error: null
        });
        render(<StudySentenceUnscramble language="en" />);
        await waitFor(() => {
            expect(screen.getByText('No sentence unscramble exercises found for this language.')).toBeInTheDocument();
        });
    });
});
