import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // To mock 'navigate' if used, or provide context
import MyStudySetsPage from './MyStudySetsPage';
import { I18nProvider } from '../../i18n/I18nContext';
import { AuthProvider } from '../../contexts/AuthContext'; // MyStudySetsPage is a protected route

// Mock child components
jest.mock('../../components/StudySets/StudySetList', () => ({ onCreateNew, onEditSetDetails, onEditSetCards }) => (
  <div data-testid="studyset-list-mock">
    <button onClick={onCreateNew}>Create New Mock</button>
    <button onClick={() => onEditSetDetails('set1')}>Edit Set Details Mock</button>
    <button onClick={() => onEditSetCards('set1')}>Edit Set Cards Mock</button>
  </div>
));
jest.mock('../../components/StudySets/StudySetEditor', () => ({ setIdProp, onSetSaved, onCancel }) => (
  <div data-testid="studyset-editor-mock">
    Set ID Prop: {setIdProp || 'new'}
    <button onClick={() => onSetSaved(setIdProp || 'new-set-id')}>Save Mock</button>
    <button onClick={onCancel}>Cancel Mock</button>
  </div>
));
jest.mock('../../components/StudySets/FlashcardEditor', () => ({ setId, onFinished }) => (
  <div data-testid="flashcard-editor-mock">
    Editing Cards for Set ID: {setId}
    <button onClick={onFinished}>Finish Card Editing Mock</button>
  </div>
));

const mockT = jest.fn((key, fallbackOrParams) => {
  if (typeof fallbackOrParams === 'string') return fallbackOrParams;
  if (fallbackOrParams && typeof fallbackOrParams === 'object' && fallbackOrParams.defaultValue) return fallbackOrParams.defaultValue;
  return key;
});

// Mock navigate (though MyStudySetsPage doesn't directly use it,
// and its direct children are mocked, so direct mocking of useNavigate here might not be needed)
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));


const renderPage = () => {
  // A mock auth context value that indicates user is authenticated
  const authContextValue = {
    isAuthenticated: true,
    currentUser: { uid: 'test-user', role: 'student' }, // Or teacher, depending on what page expects
    loadingAuth: false,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
    updateUserRoleInDb: jest.fn(),
    getToken: jest.fn().mockResolvedValue('fake-token'),
  };

  return render(
    <MemoryRouter>
      <I18nProvider i18n={{ t: mockT, language: 'COSYenglish', currentLangKey: 'COSYenglish' }}>
        <AuthProvider value={authContextValue}> {/* Provide AuthContext as it's a protected page */}
          <MyStudySetsPage />
        </AuthProvider>
      </I18nProvider>
    </MemoryRouter>
  );
};

describe('MyStudySetsPage', () => {
  beforeEach(() => {
    mockT.mockClear();
    mockNavigate.mockClear();
  });

  it('renders StudySetList by default', () => {
    renderPage();
    expect(screen.getByTestId('studyset-list-mock')).toBeInTheDocument();
    expect(screen.getByText('Manage Your Study Sets')).toBeInTheDocument();
  });

  it('switches to StudySetEditor when "Create New" is clicked in StudySetList', () => {
    renderPage();
    fireEvent.click(screen.getByText('Create New Mock'));
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: new')).toBeInTheDocument(); // Checks it's in 'new' mode
    expect(screen.getByText('← Back to Set List')).toBeInTheDocument();
  });

  it('switches to StudySetEditor for editing when "Edit Set Details" is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Edit Set Details Mock'));
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: set1')).toBeInTheDocument();
  });

  it('switches to FlashcardEditor when onSetSaved is called from StudySetEditor', () => {
    renderPage();
    // Go to create mode
    fireEvent.click(screen.getByText('Create New Mock'));
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();

    // Simulate saving the set
    fireEvent.click(screen.getByText('Save Mock'));
    expect(screen.getByTestId('flashcard-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Editing Cards for Set ID: new-set-id')).toBeInTheDocument(); // Assuming 'new-set-id' is passed back
  });

  it('switches to FlashcardEditor when onEditSetCards is called from StudySetList', () => {
    // This test assumes StudySetList has an onEditSetCards prop, which it does.
    // MyStudySetsPage passes its handleEditSetCards to this prop.
    renderPage();
    fireEvent.click(screen.getByText('Edit Set Cards Mock'));
    expect(screen.getByTestId('flashcard-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Editing Cards for Set ID: set1')).toBeInTheDocument();
  });


  it('returns to list view when "Cancel" is clicked in StudySetEditor', () => {
    renderPage();
    fireEvent.click(screen.getByText('Create New Mock')); // Go to editor
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel Mock')); // Click cancel in editor
    expect(screen.getByTestId('studyset-list-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('studyset-editor-mock')).not.toBeInTheDocument();
  });

  it('returns to list view when "Finish Card Editing" is clicked in FlashcardEditor', () => {
    renderPage();
    fireEvent.click(screen.getByText('Edit Set Cards Mock')); // Go to card editor
    expect(screen.getByTestId('flashcard-editor-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Finish Card Editing Mock'));
    expect(screen.getByTestId('studyset-list-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('flashcard-editor-mock')).not.toBeInTheDocument();
  });

  it('shows "Back to Set List" button when not in list view', () => {
    renderPage();
    expect(screen.queryByText('← Back to Set List')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Create New Mock'));
    expect(screen.getByText('← Back to Set List')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Back to Set List'));
    expect(screen.queryByText('← Back to Set List')).not.toBeInTheDocument();
  });

});
