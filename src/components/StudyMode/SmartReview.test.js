import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SmartReview from './SmartReview';

jest.mock('../../utils/performanceAnalyzer', () => ({
    analyzePerformance: () => [{ type: 'flashcard', id: 1 }],
}));

jest.mock('../../utils/srs', () => ({
    getGrammarReviewSchedule: () => ({}),
}));

describe('SmartReview', () => {
    it('renders the smart review items', async () => {
        render(<SmartReview userId="1" />);
        await waitFor(() => {
            expect(screen.getByText('flashcard: 1')).toBeInTheDocument();
        });
    });
});
