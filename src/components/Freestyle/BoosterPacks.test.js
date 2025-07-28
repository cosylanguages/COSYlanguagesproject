import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoosterPacks from './BoosterPacks';
import { I18nProvider } from '../../i18n/I18nContext';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        lang: 'en',
    }),
}));

describe('BoosterPacks', () => {
  it('renders booster packs', async () => {
    render(
        <I18nProvider>
            <MemoryRouter>
                <BoosterPacks />
            </MemoryRouter>
        </I18nProvider>
    );
    const boosterPacks = await screen.findAllByText(/Booster Pack/);
    expect(boosterPacks).toHaveLength(1);
  });
});
