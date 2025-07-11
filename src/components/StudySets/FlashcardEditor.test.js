import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardEditor from './FlashcardEditor';
import { I18nProvider } from '../../i18n/I18nContext';
import * as studySetService from '../../utils/studySetService';

jest.mock('../../utils/studySetService');

const mockT = jest.fn((key, defaultValueOrOptions, optionsOnly) => {
  let effectiveDefault = key;
  let options = {};

  if (typeof defaultValueOrOptions === 'string') {
    effectiveDefault = defaultValueOrOptions;
    if (typeof optionsOnly === 'object' && optionsOnly !== null) {
      options = optionsOnly;
    }
  } else if (typeof defaultValueOrOptions === 'object' && defaultValueOrOptions !== null) {
    options = defaultValueOrOptions;
    effectiveDefault = options.defaultValue || key;
  }

  if (key === 'flashcardEditor.confirmDeleteCard' && options && options.term1) {
    return `Are you sure you want to delete the card "${options.term1}"?`;
  }
  return effectiveDefault;
});

const mockSetId = 'set1';
const mockInitialSet = {
  id: mockSetId,
  name: 'Test Set for Cards',
  items: [
    { id: 'card1', term1: 'Hello', term2: 'Bonjour', exampleSentence: 'Hello world', notes: 'A common greeting', imageURI: 'hello.png', audioURI: 'hello.mp3' },
    { id: 'card2', term1: 'Goodbye', term2: 'Au revoir', exampleSentence: '', notes: '' },
  ],
};

const renderEditor = (props, initialSetData = mockInitialSet) => {
  studySetService.getStudySetById.mockReturnValue(initialSetData);
  studySetService.addCardToSet.mockImplementation((setId, cardData) => {
    const newCard = { ...cardData, id: `new-${Date.now()}` };
    // Simulate the service returning the updated set
    const currentSet = studySetService.getStudySetById(setId);
    const updatedItems = currentSet ? [...currentSet.items, newCard] : [newCard];
    return { ...currentSet, id: setId, items: updatedItems };
  });
  studySetService.updateCardInSet.mockImplementation((setId, cardId, updatedData) => {
    const currentSet = studySetService.getStudySetById(setId);
    if (!currentSet) return null;
    const updatedItems = currentSet.items.map(c => c.id === cardId ? {...c, ...updatedData, id: c.id } : c);
    return { ...currentSet, items: updatedItems };
  });
  studySetService.deleteCardFromSet.mockImplementation((setId, cardId) => {
     const currentSet = studySetService.getStudySetById(setId);
    if (!currentSet) return null;
    const updatedItems = currentSet.items.filter(c => c.id !== cardId);
    return { ...currentSet, items: updatedItems };
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
    // Reset service mocks for each test to ensure clean state
    studySetService.getStudySetById.mockReset();
    studySetService.addCardToSet.mockReset();
    studySetService.updateCardInSet.mockReset();
    studySetService.deleteCardFromSet.mockReset();

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
    expect(screen.getByLabelText('Term 1 (e.g., Word/Phrase):')).toBeInTheDocument();
  });

  it('displays a list of cards with all details for a given set', () => {
    renderEditor({ onFinished: onFinishedMock });
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
    expect(screen.getByText(/Ex: Hello world/)).toBeInTheDocument();
    expect(screen.getByText(/Notes: A common greeting/)).toBeInTheDocument();
    expect(screen.getByText('(has image)')).toBeInTheDocument();
    expect(screen.getByText('(has audio)')).toBeInTheDocument();

    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Au revoir')).toBeInTheDocument();
  });

  it('allows adding a new card with all fields', async () => {
    renderEditor({ onFinished: onFinishedMock });

    fireEvent.change(screen.getByLabelText('Term 1 (e.g., Word/Phrase):'), { target: { value: 'New Term' } });
    fireEvent.change(screen.getByLabelText('Term 2 (e.g., Translation/Definition):'), { target: { value: 'New Definition' } });
    fireEvent.change(screen.getByLabelText('Image URL (Optional):'), { target: { value: 'new.png' } });
    fireEvent.change(screen.getByLabelText('Audio URL (Optional):'), { target: { value: 'new.mp3' } });
    fireEvent.change(screen.getByLabelText('Example Sentence (Optional):'), { target: { value: 'New example.' } });
    fireEvent.change(screen.getByLabelText('Notes (Optional):'), { target: { value: 'New notes.' } });

    fireEvent.click(screen.getByText('Add Card'));

    await waitFor(() => {
      expect(studySetService.addCardToSet).toHaveBeenCalledWith(mockSetId, expect.objectContaining({
        term1: 'New Term',
        term2: 'New Definition',
        imageURI: 'new.png',
        audioURI: 'new.mp3',
        exampleSentence: 'New example.',
        notes: 'New notes.',
      }));
    });
    // To verify re-render with new card, we'd need to update the mockInitialSet for subsequent getStudySetById calls
    // or check for the new card in the DOM if the mock addCardToSet updated the list passed to setCards
    // The current mock for addCardToSet returns an updated set. The component calls loadSetDetails.
    // Let's ensure getStudySetById is called again by loadSetDetails after add.
    // This requires loadSetDetails to be called after addCardToSet resolves and setCards is called.
    // A better way: mock addCardToSet to directly return the full updated set.
    // The current mock for addCardToSet is already doing this.

    // Re-render or wait for component to update its internal 'cards' state
    // This is tricky because the mock service returns a new set, but the component's internal 'cards' state
    // is derived from 'studySet' which is set by 'getStudySetById'.
    // The component calls loadSetDetails implicitly via useEffect on setId.
    // A successful add calls setCards(updatedSet.items).
    expect(await screen.findByText('New Term')).toBeInTheDocument();
    expect(await screen.findByText(/Notes: New notes./)).toBeInTheDocument();
  });

  it('allows editing an existing card with all fields', async () => {
    renderEditor({ onFinished: onFinishedMock });
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByLabelText('Term 1 (e.g., Word/Phrase):')).toHaveValue('Hello');
    expect(screen.getByLabelText('Image URL (Optional):')).toHaveValue('hello.png');

    fireEvent.change(screen.getByLabelText('Term 1 (e.g., Word/Phrase):'), { target: { value: 'Hello Updated' } });
    fireEvent.change(screen.getByLabelText('Notes (Optional):'), { target: { value: 'Updated notes.' } });
    fireEvent.click(screen.getByText('Save Card'));

    await waitFor(() => {
      expect(studySetService.updateCardInSet).toHaveBeenCalledWith(mockSetId, 'card1', expect.objectContaining({
        term1: 'Hello Updated',
        notes: 'Updated notes.',
      }));
    });
    expect(await screen.findByText('Hello Updated')).toBeInTheDocument();
    expect(await screen.findByText(/Notes: Updated notes./)).toBeInTheDocument();
  });

  it('allows deleting a card', async () => {
    renderEditor({ onFinished: onFinishedMock });
    expect(screen.getByText('Hello')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete the card "Hello"?');
    await waitFor(() => {
      expect(studySetService.deleteCardFromSet).toHaveBeenCalledWith(mockSetId, 'card1');
    });
    // After deletion, the component's 'cards' state should update
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
  });

  it('calls onFinished when "Done Editing Cards" button is clicked', () => {
    renderEditor({ onFinished: onFinishedMock });
    fireEvent.click(screen.getByText('Done Editing Cards'));
    expect(onFinishedMock).toHaveBeenCalledTimes(1);
  });

});
