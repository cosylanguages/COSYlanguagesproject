// src/__mocks__/react-router-dom.js

// Create and export the mock functions so tests can import and assert them
export const mockNavigateForTest = jest.fn();
export const mockUseLocationForTest = jest.fn(() => ({ pathname: '/my-sets', search: '', hash: '', state: null, key: 'testKey' }));
export const mockUseParamsForTest = jest.fn(() => ({}));

// Export the hooks directly using these mock functions
export const useNavigate = () => mockNavigateForTest;
export const useLocation = mockUseLocationForTest;
export const useParams = mockUseParamsForTest;

// If other components imported by MyStudySetsPage (not direct children but deeper dependencies)
// were to import other things from 'react-router-dom' (like Link, Outlet, Routes, Route),
// those would also need to be mocked here if we are not using jest.requireActual.
// For now, this covers what MyStudySetsPage.js itself imports.
export const Link = jest.fn(({ to, children }) => <a href={to}>{children}</a>);
export const Outlet = jest.fn(() => <div data-testid="mock-outlet"></div>);
// Add other common RRD components if they might be pulled in by children,
// even if MyStudySetsPage doesn't use them directly.
// This makes the mock more robust for components that might render <Link> etc.
// If not needed, they can be removed.
