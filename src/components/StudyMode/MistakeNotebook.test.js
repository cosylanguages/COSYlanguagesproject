import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MistakeNotebook from './MistakeNotebook';

jest.mock('../../utils/mistakeLogger', () => ({
    getMistakes: () => [
        {
            type: 'grammar',
            question: 'What is the past tense of "go"?',
            userAnswer: 'goed',
            correctAnswer: 'went',
            timestamp: new Date().toISOString(),
        },
    ],
}));

describe('MistakeNotebook', () => {
    it('renders the mistakes', async () => {
        render(<MistakeNotebook />);
        await waitFor(() => {
            expect(screen.getByText('What is the past tense of "go"?')).toBeInTheDocument();
        });
    });
});
