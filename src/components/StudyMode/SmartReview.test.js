import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SmartReview from './SmartReview';

jest.mock('../../utils/performanceAnalyzer', () => ({
    analyzePerformance: () => [{ type: 'flashcard', data: { id: 1, front: 'Hello', back: 'World', interval: 1, factor: 2.5 } }],
}));

jest.mock('../../utils/srs', () => ({
    getGrammarReviewSchedule: () => ({}),
}));

describe('SmartReview', () => {
    it('renders the smart review items', async () => {
        render(<I18nProvider><SmartReview userId="1" /></I18nProvider>);
        await waitFor(() => {
            expect(screen.getByText('flashcard: 1')).toBeInTheDocument();
        });
    });
});
