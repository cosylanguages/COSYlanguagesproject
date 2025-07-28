import React from 'react';
import { render, screen } from '@testing-library/react';
import BoosterPacks from './BoosterPacks';
import { I18nProvider } from '../../i18n/I18nContext';

describe('BoosterPacks', () => {
  it('renders booster packs', async () => {
    render(<I18nProvider><BoosterPacks /></I18nProvider>);
    const boosterPacks = await screen.findAllByText(/Booster Pack/);
    expect(boosterPacks).toHaveLength(1);
  });
});
