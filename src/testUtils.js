import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { I18nProvider } from './i18n/I18nContext';

const AllTheProviders = ({ children }) => {
  return (
    <I18nProvider>
      <MemoryRouter>
        <AuthProvider>
          <UserProfileProvider>
            {children}
          </UserProfileProvider>
        </AuthProvider>
      </MemoryRouter>
    </I18nProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
