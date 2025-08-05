import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { I18nProvider } from './i18n/I18nContext';
import { LatinizationProvider } from './contexts/LatinizationContext';
import { PlanProvider } from './contexts/PlanContext';
import { StudyProvider } from './contexts/StudyContext';
import { StudySetProvider } from './contexts/StudySetContext';
import { FreestyleProvider } from './contexts/FreestyleContext';

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
                <LatinizationProvider>
                  <PlanProvider>
                    <StudyProvider>
                      <StudySetProvider>
                        <FreestyleProvider>
                          {children}
                        </FreestyleProvider>
                      </StudySetProvider>
                    </StudyProvider>
                  </PlanProvider>
                </LatinizationProvider>
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
