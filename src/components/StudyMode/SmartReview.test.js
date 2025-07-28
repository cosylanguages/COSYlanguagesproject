import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SmartReview from './SmartReview';
import { I18nProvider, useI18n } from '../../i18n/I18nContext';

jest.mock('../../utils/performanceAnalyzer', () => ({
    analyzePerformance: () => [{ type: 'flashcard', data: { id: 1, front: 'Hello', back: 'World', interval: 1, factor: 2.5 } }],
}));

jest.mock('../../utils/srs', () => ({
    getGrammarReviewSchedule: () => ({}),
}));

jest.mock('../../i18n/I18nContext', () => ({
    ...jest.requireActual('../../i18n/I18nContext'),
    useI18n: () => ({
        t: (key, options) => options?.defaultValue || key,
        language: 'en',
    }),
}));

describe('SmartReview', () => {
    it('renders the smart review items', async () => {
        render(
            <MemoryRouter>
                <I18nProvider>
                    <SmartReview userId="1" />
                </I18nProvider>
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText('flashcard: 1')).toBeInTheDocument();
        });
    });
});
