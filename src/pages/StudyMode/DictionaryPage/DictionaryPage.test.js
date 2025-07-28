import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter }_from_'react-router-dom';
import DictionaryPage from './DictionaryPage';
import { I18nProvider, useI18n } from '../../../i18n/I18nContext';

jest.mock('../../../i18n/I18nContext', () => ({
    ...jest.requireActual('../../../i18n/I18nContext'),
    useI18n: () => ({
        t: (key, options) => options?.defaultValue || key,
        language: 'en',
    }),
}));

test('renders dictionary page', () => {
    render(
        <MemoryRouter initialEntries={['/en/dictionary']}>
            <I18nProvider>
                <DictionaryPage />
            </I18nProvider>
        </MemoryRouter>
    );
    const linkElement = screen.getByText(/Dictionary/i);
    expect(linkElement).toBeInTheDocument();
});
