import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardEditor from './FlashcardEditor';
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
  // Handle simple variable replacement for confirmDeleteCard
  if (key === 'flashcardEditor.confirmDeleteCard' && defaultValueOrOptions && typeof defaultValueOrOptions === 'object' && defaultValueOrOptions.term1) {
    return `Are you sure you want to delete the card "${defaultValueOrOptions.term1}"?`;
  }
  return key;
});

const mockSetId = 'set1';
const mockInitialSet = {
  id: mockSetId,
  name: 'Test Set for Cards',
  items: [
    { id: 'card1', term1: 'Hello', term2: 'Bonjour', exampleSentence: 'Hello world' },
    { id: 'card2', term1: 'Goodbye', term2: 'Au revoir', exampleSentence: '' },
  ],
};

const renderEditor = (props, initialSetData = mockInitialSet) => {
  studySetService.getStudySetById.mockReturnValue(initialSetData);
  // Mock add/update/delete to return the (potentially modified) set or a relevant part
  studySetService.addCardToSet.mockImplementation((setId, cardData) => {
    const newCard = { ...cardData, id: `new-${Date.now()}` };
    const updatedSet = { ...initialSetData, items: [...initialSetData.items, newCard] };
    // In reality, the service would update localStorage and then we'd re-fetch or update state.
    // For the mock, we can simulate this by returning the updated set.
    return updatedSet;
  });
  studySetService.updateCardInSet.mockImplementation((setId, cardId, updatedData) => {
    const updatedItems = initialSetData.items.map(c => c.id === cardId ? {...c, ...updatedData} : c);
    return { ...initialSetData, items: updatedItems };
  });
  studySetService.deleteCardFromSet.mockImplementation((setId, cardId) => {
    const updatedItems = initialSetData.items.filter(c => c.id !== cardId);
    return { ...initialSetData, items: updatedItems };
  });


  return render(
    <I18nProvider i18n={{ t: mockT, language: 'COSYenglish', currentLangKey: 'COSYenglish' }}>
      <FlashcardEditor setId={mockSetId} {...props} />
    </I18nProvider>
  );
};

describe('FlashcardEditor', () => {
  let onFinishedMock;

  beforeEach(() => {
    mockT.mockClear();
    studySetService.getStudySetById.mockClear();
    studySetService.addCardToSet.mockClear();
    studySetService.updateCardInSet.mockClear();
    studySetService.deleteCardFromSet.mockClear();
    onFinishedMock = jest.fn();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly when a set has no cards', () => {
    renderEditor({ onFinished: onFinishedMock }, { ...mockInitialSet, items: [] });
    expect(screen.getByText(`Editing Cards for: ${mockInitialSet.name}`)).toBeInTheDocument();
    expect(screen.getByText('No cards in this set yet. Add one above!')).toBeInTheDocument();
    expect(screen.getByLabelText('Term 1 (e.g., Word/Phrase):')).toBeInTheDocument(); // Add form is present
  });

  it('displays a list of cards for a given set', () => {
    renderEditor({ onFinished: onFinishedMock });
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
    expect(screen.getByText(/Ex: Hello world/)).toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Au revoir')).toBeInTheDocument();
  });

  it('allows adding a new card', async () => {
    renderEditor({ onFinished: onFinishedMock });

    fireEvent.change(screen.getByLabelText('Term 1 (e.g., Word/Phrase):'), { target: { value: 'New Term' } });
    fireEvent.change(screen.getByLabelText('Term 2 (e.g., Translation/Definition):'), { target: { value: 'New Definition' } });
    fireEvent.click(screen.getByText('Add Card'));

    await waitFor(() => {
      expect(studySetService.addCardToSet).toHaveBeenCalledWith(mockSetId, expect.objectContaining({
        term1: 'New Term',
        term2: 'New Definition',
      }));
    });
    // The component should re-render with the new card list.
    // The mock addCardToSet returns the updated set, which should trigger a re-render.
    // This assertion depends on the mock correctly updating the 'cards' state in the component.
    // For a more direct test, we'd check if the state update function (setCards) was called.
    // However, checking the DOM for the result is also valid.
    // The mock currently returns a set with the new card, so loadSetDetails should update.
    expect(screen.getByText('New Term')).toBeInTheDocument();
  });

  it('allows editing an existing card', async () => {
    renderEditor({ onFinished: onFinishedMock });
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]); // Click edit for "Hello"

    // Form should pre-fill
    expect(screen.getByLabelText('Term 1 (e.g., Word/Phrase):')).toHaveValue('Hello');
    expect(screen.getByLabelText('Term 2 (e.g., Translation/Definition):')).toHaveValue('Bonjour');

    fireEvent.change(screen.getByLabelText('Term 1 (e.g., Word/Phrase):'), { target: { value: 'Hello Updated' } });
    fireEvent.click(screen.getByText('Save Card'));

    await waitFor(() => {
      expect(studySetService.updateCardInSet).toHaveBeenCalledWith(mockSetId, 'card1', expect.objectContaining({
        term1: 'Hello Updated',
      }));
    });
    expect(screen.getByText('Hello Updated')).toBeInTheDocument();
  });

  it('allows deleting a card', async () => {
    renderEditor({ onFinished: onFinishedMock });
    expect(screen.getByText('Hello')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]); // Click delete for "Hello"

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete the card "Hello"?');
    await waitFor(() => {
      expect(studySetService.deleteCardFromSet).toHaveBeenCalledWith(mockSetId, 'card1');
    });
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument(); // Ensure other card is still there
  });

  // onFinished prop is not directly called by FlashcardEditor itself, but by its parent (MyStudySetsPage)
  // So, a test for onFinished here isn't relevant unless FlashcardEditor had its own "Done" button.
  // The onFinished is tested in MyStudySetsPage.test.js by interacting with the mock FlashcardEditor.

});
