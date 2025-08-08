import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FlashcardsTool from './FlashcardsTool';
import * as studySetService from '../../../utils/studySetService';

jest.mock('../../../utils/studySetService');
jest.mock('../FlashcardPlayer', () => () => <div>Flashcard Player</div>);
jest.mock('./MemoryGame', () => () => <div>Memory Game</div>);

const mockStudySets = [
  { id: '1', name: 'Test Set 1', items: [{ id: '1', word: 'Hello', imageUrl: 'hello.jpg' }] },
];

describe('FlashcardsTool', () => {
  beforeEach(() => {
    studySetService.getStudySets.mockReturnValue(mockStudySets);
  });

  it('should render the flashcard player by default', async () => {
    render(<FlashcardsTool />);
    await waitFor(() => {
        expect(screen.getByText('Flashcard Player')).toBeInTheDocument();
    });
  });

  it('should render the memory game when selected', async () => {
    render(<FlashcardsTool />);
    await waitFor(() => {}); // wait for study sets to be loaded
    const gameModeSelector = screen.getByLabelText(/select a game/i);
    fireEvent.change(gameModeSelector, { target: { value: 'memory' } });
    expect(screen.getByText('Memory Game')).toBeInTheDocument();
  });
});
