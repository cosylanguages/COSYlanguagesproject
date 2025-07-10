import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudySetEditor from './StudySetEditor';
import { I18nProvider } from '../../i18n/I18nContext';
import * as studySetService from '../../utils/studySetService';

jest.mock('../../utils/studySetService');

const mockT = jest.fn((key, defaultValueOrOptions) => {
  if (typeof defaultValueOrOptions === 'string') {
    return defaultValueOrOptions;
  }
  if (defaultValueOrOptions && typeof defaultValueOrOptions === 'object' && defaultValueOrOptions.defaultValue) {
    return defaultValueOrOptions.defaultValue;
  }
  return key;
});

const mockNavigate = jest.fn();
// No need to mock useParams if we pass setIdProp explicitly as planned
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: () => ({ setId: undefined }), // Default to no setId from params
//   useNavigate: () => mockNavigate,
// }));


const renderEditor = (props) => {
  return render(
    <I18nProvider i18n={{ t: mockT, language: 'COSYenglish', currentLangKey: 'COSYenglish' }}>
      <StudySetEditor {...props} />
    </I18nProvider>
  );
};

describe('StudySetEditor', () => {
  let onSetSavedMock, onCancelMock;

  beforeEach(() => {
    mockT.mockClear();
    studySetService.getStudySetById.mockClear();
    studySetService.saveStudySet.mockClear();
    mockNavigate.mockClear();

    onSetSavedMock = jest.fn();
    onCancelMock = jest.fn();
  });

  describe('Create Mode', () => {
    it('renders empty form fields initially', () => {
      renderEditor({ onSetSaved: onSetSavedMock, onCancel: onCancelMock });
      expect(screen.getByText('Create New Study Set')).toBeInTheDocument();
      expect(screen.getByLabelText('Set Name:')).toHaveValue('');
      expect(screen.getByLabelText('Description (Optional):')).toHaveValue('');
      // Default language code might be set by currentLangKey from useI18n
      // For this test, we can check it's roughly what we expect (e.g., COSYenglish or an empty string if currentLangKey is null)
      expect(screen.getByLabelText('Language Code:')).toHaveValue('COSYenglish'); // Assuming mock currentLangKey
    });

    it('calls saveStudySet with new data and onSetSaved on submit', async () => {
      const newSet = { id: 'newId123', name: 'Test Set', items: [] };
      studySetService.saveStudySet.mockReturnValue(newSet);

      renderEditor({ onSetSaved: onSetSavedMock, onCancel: onCancelMock });

      fireEvent.change(screen.getByLabelText('Set Name:'), { target: { value: 'Test Set' } });
      fireEvent.change(screen.getByLabelText('Description (Optional):'), { target: { value: 'A test description' } });
      fireEvent.change(screen.getByLabelText('Language Code:'), { target: { value: 'COSYtestlang' } });

      fireEvent.click(screen.getByText('Create Set'));

      await waitFor(() => {
        expect(studySetService.saveStudySet).toHaveBeenCalledWith(
          expect.objectContaining({
            id: undefined, // Important for create mode
            name: 'Test Set',
            description: 'A test description',
            languageCode: 'COSYtestlang',
            items: [],
          })
        );
      });
      expect(onSetSavedMock).toHaveBeenCalledWith(newSet.id);
    });

    it('shows error if name is missing on submit', () => {
      renderEditor({ onSetSaved: onSetSavedMock, onCancel: onCancelMock });
      fireEvent.click(screen.getByText('Create Set'));
      expect(screen.getByText('Set name is required.')).toBeInTheDocument();
      expect(studySetService.saveStudySet).not.toHaveBeenCalled();
      expect(onSetSavedMock).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked', () => {
      renderEditor({ onSetSaved: onSetSavedMock, onCancel: onCancelMock });
      fireEvent.click(screen.getByText('Cancel'));
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edit Mode', () => {
    const existingSet = {
      id: 'editId1',
      name: 'Existing Set',
      description: 'Original Description',
      languageCode: 'COSYfrench',
      items: [{id: 'card1'}],
      createdAt: new Date().toISOString()
    };

    beforeEach(() => {
      studySetService.getStudySetById.mockReturnValue(existingSet);
    });

    it('loads and pre-fills form fields', () => {
      renderEditor({ setIdProp: 'editId1', onSetSaved: onSetSavedMock, onCancel: onCancelMock });
      expect(screen.getByText('Edit Study Set')).toBeInTheDocument();
      expect(studySetService.getStudySetById).toHaveBeenCalledWith('editId1');
      expect(screen.getByLabelText('Set Name:')).toHaveValue('Existing Set');
      expect(screen.getByLabelText('Description (Optional):')).toHaveValue('Original Description');
      expect(screen.getByLabelText('Language Code:')).toHaveValue('COSYfrench');
    });

    it('calls saveStudySet with updated data (including ID) and onSetSaved on submit', async () => {
      const updatedVersionOfSet = { ...existingSet, name: 'Updated Name' };
      studySetService.saveStudySet.mockReturnValue(updatedVersionOfSet);

      renderEditor({ setIdProp: 'editId1', onSetSaved: onSetSavedMock, onCancel: onCancelMock });

      fireEvent.change(screen.getByLabelText('Set Name:'), { target: { value: 'Updated Name' } });
      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(studySetService.saveStudySet).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'editId1',
            name: 'Updated Name',
            description: 'Original Description', // Unchanged
            languageCode: 'COSYfrench',       // Unchanged
            items: existingSet.items,          // Preserved
            createdAt: existingSet.createdAt   // Preserved
          })
        );
      });
      expect(onSetSavedMock).toHaveBeenCalledWith('editId1');
    });

    it('handles case where set is not found in edit mode', () => {
      studySetService.getStudySetById.mockReturnValue(null);
      renderEditor({ setIdProp: 'nonexistentSet', onSetSaved: onSetSavedMock, onCancel: onCancelMock });
      expect(screen.getByText('Study set not found.')).toBeInTheDocument();
      // Form should not be rendered, or be disabled
      expect(screen.queryByLabelText('Set Name:')).toBeNull();
    });
  });
});
