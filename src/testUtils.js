import React from 'react';
import { act } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, UserProfileProvider } from './contexts';
import { I18nProvider } from './i18n';

const mockI18n = {
  t: (key) => key,
  language: 'en',
  currentLangKey: 'en'
};

const AllTheProviders = ({ children, initialEntries = ['/en'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:lang" element={
          <I18nProvider i18n={mockI18n}>
            <AuthProvider>
              <UserProfileProvider>
                {children}
              </UserProfileProvider>
            </AuthProvider>
          </I18nProvider>
        } />
      </Routes>
    </MemoryRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
