import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudyFillInTheBlanks from './StudyFillInTheBlanks';
import { loadFillInTheBlanksData } from '../../../utils/exerciseDataService';

jest.mock('../../../utils/exerciseDataService');

describe('StudyFillInTheBlanks', () => {
    it('renders the exercise when data is loaded successfully', async () => {
        loadFillInTheBlanksData.mockResolvedValue({
            data: [{ id: 1, sentenceParts: ['Hello', null, '!'], answers: ['world'] }],
            error: null
        });
        render(<StudyFillInTheBlanks language="en" />);
        await waitFor(() => {
            expect(screen.getByText('Fill in the Blanks (Study Mode)')).toBeInTheDocument();
            expect(screen.getByText('Hello')).toBeInTheDocument();
        });
    });

    it('displays an error message when data fails to load', async () => {
        loadFillInTheBlanksData.mockResolvedValue({
            data: null,
            error: { message: 'Failed to load' }
        });
        render(<StudyFillInTheBlanks language="en" />);
        await waitFor(() => {
            expect(screen.getByText('Error: Failed to load')).toBeInTheDocument();
        });
    });

    it('displays a message when no exercises are available', async () => {
        loadFillInTheBlanksData.mockResolvedValue({
            data: [],
            error: null
        });
        render(<StudyFillInTheBlanks language="en" />);
        await waitFor(() => {
            expect(screen.getByText('No fill in the blanks exercises found for this language.')).toBeInTheDocument();
        });
    });
});
