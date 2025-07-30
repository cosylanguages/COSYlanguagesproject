import React from 'react';
import { render, screen } from '../../testUtils';
import BoosterPacks from './BoosterPacks';

jest.mock('../../i18n/I18nContext', () => ({
    ...jest.requireActual('../../i18n/I18nContext'),
    useI18n: () => ({
        t: (key, options) => options?.defaultValue || key,
        language: 'en',
    }),
}));

describe('BoosterPacks', () => {
  it('renders booster packs', async () => {
    render(<BoosterPacks />, { initialEntries: ['/en/freestyle'] });
    const boosterPacks = await screen.findAllByText(/Booster Pack/);
    expect(boosterPacks.length).toBeGreaterThan(0);
  });
});
