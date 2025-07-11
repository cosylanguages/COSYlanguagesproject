import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyStudySetsPage from './MyStudySetsPage';
import { I18nProvider } from '../../i18n/I18nContext';
import { AuthProvider } from '../../contexts/AuthContext';

// Import the mocked functions from the manual mock
// Jest will automatically use __mocks__/react-router-dom.js
import { mockNavigateForTest, mockUseLocationForTest, mockUseParamsForTest } from 'react-router-dom';

// Mock child components
jest.mock('../../components/StudySets/StudySetList', () => ({ onCreateNew, onEditSetDetails, onEditSetCards, onLaunchStudyPlayer }) => (
  <div data-testid="studyset-list-mock">
    <button onClick={onCreateNew}>Create New Mock</button>
    <button onClick={() => onEditSetDetails('set1')}>Edit Set Details Mock</button>
    <button onClick={() => onEditSetCards('set1')}>Edit Set Cards Mock</button>
    <button onClick={() => onLaunchStudyPlayer('set1')}>Study Set Mock</button>
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
jest.mock('../../components/StudyMode/StudentTools/FlashcardPlayer', () => ({ studySetId, initialSetData, onExitPlayer, source }) => (
    <div data-testid="flashcard-player-mock">
      Playing Set ID: {studySetId}
      <button onClick={onExitPlayer}>Exit Player Mock</button>
    </div>
));


const mockT = jest.fn((key, fallbackOrParams) => {
  if (typeof fallbackOrParams === 'string') return fallbackOrParams;
  if (fallbackOrParams && typeof fallbackOrParams === 'object' && fallbackOrParams.defaultValue) return fallbackOrParams.defaultValue;
  return key;
});

// The inline jest.mock for react-router-dom is removed.
// Jest will now automatically use the one in __mocks__/react-router-dom.js


const renderPage = (pathname = '/my-sets', params = {}) => {
  // Update the mock implementation for useLocation and useParams for this render
  mockUseLocationForTest.mockReturnValue({ pathname, search: '', hash: '', state: null, key: 'testKey' });
  mockUseParamsForTest.mockReturnValue(params);

  const authContextValue = {
    isAuthenticated: true,
    currentUser: { uid: 'test-user', role: 'student' },
    loadingAuth: false,
    login: jest.fn(), logout: jest.fn(), signup: jest.fn(), updateUserRoleInDb: jest.fn(),
    getToken: jest.fn().mockResolvedValue('fake-token'),
  };

  return render(
      <I18nProvider i18n={{ t: mockT, language: 'COSYenglish', currentLangKey: 'COSYenglish' }}>
        <AuthProvider value={authContextValue}>
          <MyStudySetsPage />
        </AuthProvider>
      </I18nProvider>
  );
};

describe('MyStudySetsPage', () => {
  beforeEach(() => {
    mockT.mockClear();
    // Clear the imported mock function
    mockNavigateForTest.mockClear();
    mockUseLocationForTest.mockClear();
    mockUseParamsForTest.mockClear();

    // Reset to default mock implementations for location and params for each test
    mockUseLocationForTest.mockImplementation(() => ({ pathname: '/my-sets', search: '', hash: '', state: null, key: 'testKey' }));
    mockUseParamsForTest.mockImplementation(() => ({}));

    jest.clearAllMocks(); // This will clear mocks for studySetService etc. but not the RRD mocks from __mocks__
  });

  it('renders StudySetList by default when path is /my-sets', () => {
    renderPage('/my-sets');
    expect(screen.getByTestId('studyset-list-mock')).toBeInTheDocument();
    expect(screen.getByText('Manage Your Study Sets')).toBeInTheDocument();
  });

  it('switches to StudySetEditor when "Create New" is clicked in StudySetList', () => {
    renderPage('/my-sets');
    fireEvent.click(screen.getByText('Create New Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/new');
  });

  it('switches to StudySetEditor for editing when "Edit Set Details" is clicked', () => {
    renderPage('/my-sets');
    fireEvent.click(screen.getByText('Edit Set Details Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/set1/edit');
  });

  it('navigates to FlashcardEditor when "Edit Set Cards Mock" button in StudySetList is clicked', () => {
    renderPage('/my-sets');
    fireEvent.click(screen.getByText('Edit Set Cards Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/set1/cards');
  });

  it('navigates to study player when "Study Set Mock" is clicked', () => {
    renderPage('/my-sets');
    fireEvent.click(screen.getByText('Study Set Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/set1/study');
  });

  // To test views other than list, we need to control useLocation and useParams
  // MyStudySetsPage determines view based on location.pathname and params.

  it('shows StudySetEditor when path is /my-sets/new', () => {
    renderPage('/my-sets/new');
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: new')).toBeInTheDocument();
  });

  it('shows StudySetEditor when path is /my-sets/:setId/edit', () => {
    renderPage('/my-sets/setABC/edit', { setId: 'setABC' });
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: setABC')).toBeInTheDocument();
  });

  it('shows FlashcardEditor when path is /my-sets/:setId/cards', () => {
    // Mock getStudySetById as FlashcardEditor might try to load the set
    // For this test, we are just checking if FlashcardEditor is rendered.
    // Actual data loading by FlashcardEditor is its own unit test.
    const mockGetStudySetById = jest.fn(() => ({ id: 'setXYZ', name: 'Test Set', items: [] }));
    jest.mock('../../utils/studySetService', () => ({
        ...jest.requireActual('../../utils/studySetService'),
        getStudySetById: () => mockGetStudySetById(),
    }));

    renderPage('/my-sets/setXYZ/cards', { setId: 'setXYZ' });
    expect(screen.getByTestId('flashcard-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Editing Cards for Set ID: setXYZ')).toBeInTheDocument();
  });

  it('shows FlashcardPlayer when path is /my-sets/:setId/study', () => {
    const mockSetData = { id: 'set123', name: 'Study Time', items: [{id: 'c1', term1: 't1', term2: 'd1'}] };
    // MyStudySetsPage calls getStudySetById for the player
    const mockGetStudySetById = jest.fn(() => mockSetData);
     jest.mock('../../utils/studySetService', () => ({ // Re-mock for this specific test case if needed
        ...jest.requireActual('../../utils/studySetService'),
        getStudySetById: () => mockGetStudySetById(),
    }));

    renderPage('/my-sets/set123/study', { setId: 'set123' });
    expect(screen.getByTestId('flashcard-player-mock')).toBeInTheDocument();
    expect(screen.getByText('Playing Set ID: set123')).toBeInTheDocument();
    expect(mockGetStudySetById).toHaveBeenCalledWith('set123');
  });

  it('navigates to card editor after set is saved from StudySetEditor (new set)', () => {
    renderPage('/my-sets/new'); // Start in the new set editor view
    // Simulate the onSetSaved callback from StudySetEditor
    fireEvent.click(screen.getByText('Save Mock')); // This will call onSetSaved with 'new-set-id'
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/new-set-id/cards');
  });

  it('navigates to card editor after set is saved from StudySetEditor (existing set)', () => {
    renderPage('/my-sets/setABC/edit', { setId: 'setABC' }); // Start in edit view for 'setABC'
    fireEvent.click(screen.getByText('Save Mock')); // This will call onSetSaved with 'setABC'
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/setABC/cards');
  });

  it('navigates to list view when StudySetEditor is cancelled', () => {
    renderPage('/my-sets/new'); // Start in a view that shows StudySetEditor
    fireEvent.click(screen.getByText('Cancel Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });

  it('navigates to list view when FlashcardEditor is finished', () => {
    renderPage('/my-sets/setXYZ/cards', { setId: 'setXYZ' }); // Start in FlashcardEditor view
    fireEvent.click(screen.getByText('Finish Card Editing Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });

  it('navigates to list view when FlashcardPlayer is exited', () => {
     const mockSetData = { id: 'set123', name: 'Study Time', items: [{id: 'c1', term1: 't1', term2: 'd1'}] };
     jest.mock('../../utils/studySetService', () => ({
        ...jest.requireActual('../../utils/studySetService'),
        getStudySetById: () => mockSetData,
    }));
    renderPage('/my-sets/set123/study', { setId: 'set123' }); // Start in FlashcardPlayer view
    fireEvent.click(screen.getByText('Exit Player Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });

});
