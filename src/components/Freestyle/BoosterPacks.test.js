import React from 'react';
import { render, screen } from '@testing-library/react';
import BoosterPacks from './BoosterPacks';

jest.mock('../../hooks/useAuthentication', () => ({
  useAuthentication: () => ({
    user: {
      uid: 'test-user-id',
      // any other necessary user properties
    },
    loading: false,
    error: null,
  }),
}));


describe('BoosterPacks', () => {
  it('renders booster packs', async () => {
    render(<I18nProvider><BoosterPacks /></I18nProvider>);
    const boosterPacks = await screen.findAllByText(/Booster Pack/);
    expect(boosterPacks).toHaveLength(1);
  });
});
