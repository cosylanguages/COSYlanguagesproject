import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../testUtils';
import '@testing-library/jest-dom';
import StudySetEditor from './StudySetEditor';
import * as studySetService from '../../utils/studySetService';

jest.mock('../../utils/studySetService');

describe('StudySetEditor', () => {
  let onSetSavedMock, onCancelMock;

  beforeEach(() => {
    studySetService.getStudySetById.mockClear();
    studySetService.saveStudySet.mockClear();

    onSetSavedMock = jest.fn();
    onCancelMock = jest.fn();
  });

  describe('Create Mode', () => {
    it('renders empty form fields initially', () => {
      render(<StudySetEditor onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);
      expect(screen.getByText('Create New Study Set')).toBeInTheDocument();
      expect(screen.getByLabelText('Set Name:')).toHaveValue('');
      expect(screen.getByLabelText('Description (Optional):')).toHaveValue('');
      expect(screen.getByLabelText('Language Code:')).toHaveValue('en');
    });

    it('calls saveStudySet with new data and onSetSaved on submit', async () => {
      const newSet = { id: 'newId123', name: 'Test Set', items: [] };
      studySetService.saveStudySet.mockReturnValue(newSet);

      render(<StudySetEditor onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);

      fireEvent.change(screen.getByLabelText('Set Name:'), { target: { value: 'Test Set' } });
      fireEvent.change(screen.getByLabelText('Description (Optional):'), { target: { value: 'A test description' } });
      fireEvent.change(screen.getByLabelText('Language Code:'), { target: { value: 'COSYtestlang' } });

      fireEvent.click(screen.getByText('Create Set'));

      await waitFor(() => {
        expect(studySetService.saveStudySet).toHaveBeenCalledWith(
          expect.objectContaining({
            id: undefined,
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
      render(<StudySetEditor onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);
      fireEvent.click(screen.getByText('Create Set'));
      expect(screen.getByText('Set name is required.')).toBeInTheDocument();
      expect(studySetService.saveStudySet).not.toHaveBeenCalled();
      expect(onSetSavedMock).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked', () => {
      render(<StudySetEditor onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);
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
      render(<StudySetEditor setIdProp="editId1" onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);
      expect(screen.getByText('Edit Study Set')).toBeInTheDocument();
      expect(studySetService.getStudySetById).toHaveBeenCalledWith('editId1');
      expect(screen.getByLabelText('Set Name:')).toHaveValue('Existing Set');
      expect(screen.getByLabelText('Description (Optional):')).toHaveValue('Original Description');
      expect(screen.getByLabelText('Language Code:')).toHaveValue('COSYfrench');
    });

    it('calls saveStudySet with updated data (including ID) and onSetSaved on submit', async () => {
      const updatedVersionOfSet = { ...existingSet, name: 'Updated Name' };
      studySetService.saveStudySet.mockReturnValue(updatedVersionOfSet);

      render(<StudySetEditor setIdProp="editId1" onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);

      fireEvent.change(screen.getByLabelText('Set Name:'), { target: { value: 'Updated Name' } });
      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(studySetService.saveStudySet).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'editId1',
            name: 'Updated Name',
            description: 'Original Description',
            languageCode: 'COSYfrench',
            items: existingSet.items,
            createdAt: existingSet.createdAt
          })
        );
      });
      expect(onSetSavedMock).toHaveBeenCalledWith('editId1');
    });

    it('handles case where set is not found in edit mode', () => {
      studySetService.getStudySetById.mockReturnValue(null);
      render(<StudySetEditor setIdProp="nonexistentSet" onSetSaved={onSetSavedMock} onCancel={onCancelMock} />);
      expect(screen.getByText('Study set not found.')).toBeInTheDocument();
      expect(screen.queryByLabelText('Set Name:')).toBeNull();
    });
  });
});
