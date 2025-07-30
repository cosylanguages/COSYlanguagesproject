import React from 'react';
import { render, screen, fireEvent, act } from '../../testUtils';
import '@testing-library/jest-dom';
import MyStudySetsPage from './MyStudySetsPage';
import { mockNavigateForTest, mockUseLocationForTest, mockUseParamsForTest } from 'react-router-dom';

// --- Mock studySetService at the top level ---
const mockGetStudySetById = jest.fn();
const mockGetAllStudySets = jest.fn(() => []); // For StudySetList if it's not fully mocked
const mockDeleteStudySet = jest.fn(() => true);
const mockSaveStudySet = jest.fn(set => ({ ...set, id: set.id || 'mock-saved-id' }));

jest.mock('../../utils/studySetService', () => ({
  getStudySetById: (...args) => mockGetStudySetById(...args),
  getStudySets: (...args) => mockGetAllStudySets(...args), // getStudySets is used by StudySetList
  deleteStudySet: (...args) => mockDeleteStudySet(...args),
  saveStudySet: (...args) => mockSaveStudySet(...args),
  // Add other functions from studySetService if they are called and need mocking
}));

// Mock child components
jest.mock('../../components/StudySets/StudySetList', () => ({ onCreateNew, onEditSetDetails, onLaunchStudyPlayer }) => (
  <div data-testid="studyset-list-mock">
    <button onClick={onCreateNew}>Create New Mock</button>
    <button onClick={() => onEditSetDetails('set1')}>Edit Set Details Mock</button>
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
jest.mock('../../components/StudyMode/StudentTools/FlashcardPlayer', () => ({ studySetId, initialSetData, onExitPlayer, source }) => (
    <div data-testid="flashcard-player-mock">
      Playing Set ID: {studySetId} ({initialSetData?.name})
      <button onClick={onExitPlayer}>Exit Player Mock</button>
    </div>
));

const mockT = jest.fn((key, fallbackOrParams) => {
  if (typeof fallbackOrParams === 'string') return fallbackOrParams;
  if (fallbackOrParams && typeof fallbackOrParams === 'object' && fallbackOrParams.defaultValue) return fallbackOrParams.defaultValue;
  return key;
});

const renderPage = async (pathname = '/my-sets', params = {}) => {
  mockUseLocationForTest.mockReturnValue({ pathname, search: '', hash: '', state: null, key: 'testKey' });
  mockUseParamsForTest.mockReturnValue(params);

  let utils;
  // Use act for renders that trigger useEffect data fetching
  await act(async () => {
    utils = render(<MyStudySetsPage />);
  });
  return utils;
};

describe('MyStudySetsPage', () => {
  beforeEach(() => {
    mockT.mockClear();
    mockNavigateForTest.mockClear();
    mockUseLocationForTest.mockClear();
    mockUseParamsForTest.mockClear();

    mockGetStudySetById.mockClear();
    mockGetAllStudySets.mockClear().mockReturnValue([]); // Default for list view
    mockDeleteStudySet.mockClear();
    mockSaveStudySet.mockClear();

    mockUseLocationForTest.mockImplementation(() => ({ pathname: '/my-sets', search: '', hash: '', state: null, key: 'testKey' }));
    mockUseParamsForTest.mockImplementation(() => ({}));
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    if (window.alert.mockRestore) window.alert.mockRestore();
    jest.clearAllMocks(); // Clear all other mocks (RRD mocks handled by their own clear calls)
  });

  it('renders StudySetList by default when path is /my-sets', async () => {
    await renderPage('/my-sets');
    expect(screen.getByTestId('studyset-list-mock')).toBeInTheDocument();
    expect(screen.getByText('Manage Your Study Sets')).toBeInTheDocument();
  });

  it('navigates to new set editor when "Create New" is clicked', async () => {
    await renderPage('/my-sets');
    fireEvent.click(screen.getByText('Create New Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/new');
  });

  it('navigates to edit set editor when "Edit Set Details" is clicked', async () => {
    await renderPage('/my-sets');
    fireEvent.click(screen.getByText('Edit Set Details Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/set1/edit');
  });


  it('navigates to study player when "Study Set Mock" is clicked', async () => {
    await renderPage('/my-sets');
    fireEvent.click(screen.getByText('Study Set Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets/set1/study');
  });

  it('shows StudySetEditor when path is /my-sets/new', async () => {
    await renderPage('/my-sets/new');
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: new')).toBeInTheDocument();
  });

  it('shows StudySetEditor when path is /my-sets/:setId/edit', async () => {
    await renderPage('/my-sets/setABC/edit', { setId: 'setABC' });
    expect(screen.getByTestId('studyset-editor-mock')).toBeInTheDocument();
    expect(screen.getByText('Set ID Prop: setABC')).toBeInTheDocument();
  });


  it('shows FlashcardPlayer when path is /my-sets/:setId/study', async () => {
    const mockSetData = { id: 'set123', name: 'Study Time', items: [{id: 'c1', term1: 't1', term2: 'd1'}] };
    mockGetStudySetById.mockReturnValue(mockSetData); // Ensure this mock is effective

    await renderPage('/my-sets/set123/study', { setId: 'set123' });

    expect(mockGetStudySetById).toHaveBeenCalledWith('set123');
    expect(screen.getByTestId('flashcard-player-mock')).toBeInTheDocument();
    // Updated to match mock FlashcardPlayer output with initialSetData.name
    expect(screen.getByText(`Playing Set ID: set123 (${mockSetData.name})`)).toBeInTheDocument();
  });

  it('navigates to list view after set is saved from StudySetEditor (new set)', async () => {
    await renderPage('/my-sets/new');
    fireEvent.click(screen.getByText('Save Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });

  it('navigates to list view after set is saved from StudySetEditor (existing set)', async () => {
    await renderPage('/my-sets/setABC/edit', { setId: 'setABC' });
    fireEvent.click(screen.getByText('Save Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });

  it('navigates to list view when StudySetEditor is cancelled', async () => {
    await renderPage('/my-sets/new');
    fireEvent.click(screen.getByText('Cancel Mock'));
    expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });


  it('navigates to list view when FlashcardPlayer is exited', async () => {
     const mockSetData = { id: 'set123', name: 'Study Time', items: [{id: 'c1', term1: 't1', term2: 'd1'}] };
     mockGetStudySetById.mockReturnValue(mockSetData);
     await renderPage('/my-sets/set123/study', { setId: 'set123' });
     expect(screen.getByTestId('flashcard-player-mock')).toBeInTheDocument(); // Ensure player is shown first
     fireEvent.click(screen.getByText('Exit Player Mock'));
     expect(mockNavigateForTest).toHaveBeenCalledWith('/my-sets');
  });
});
