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

const AllTheProviders = ({ children, initialEntries = ['/en'], mockAuth }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:lang" element={
          <I18nProvider i18n={mockI18n}>
            <AuthProvider {...mockAuth}>
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

const customRender = (ui, options) => {
  const { mockAuth, ...renderOptions } = options || {};
  const Wrapper = ({ children }) => (
    <AllTheProviders mockAuth={mockAuth}>{children}</AllTheProviders>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
