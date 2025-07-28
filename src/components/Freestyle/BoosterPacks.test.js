import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoosterPacks from './BoosterPacks';
import { I18nProvider, useI18n } from '../../i18n/I18nContext';

jest.mock('../../i18n/I18nContext', () => ({
    ...jest.requireActual('../../i18n/I18nContext'),
    useI18n: () => ({
        t: (key, options) => options?.defaultValue || key,
        language: 'en',
    }),
}));

describe('BoosterPacks', () => {
  it('renders booster packs', async () => {
    render(
      <MemoryRouter initialEntries={['/en/freestyle']}>
        <I18nProvider>
          <BoosterPacks />
        </I18nProvider>
      </MemoryRouter>
    );
    const boosterPacks = await screen.findAllByText(/Booster Pack/);
    expect(boosterPacks.length).toBeGreaterThan(0);
  });
});
