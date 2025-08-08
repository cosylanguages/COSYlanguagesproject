import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PictureDictionaryProvider, usePictureDictionary } from '../../contexts/PictureDictionaryContext';
import TransliterableText from './TransliterableText';

// Mock the context to avoid wrapping the component in the provider in every test
jest.mock('../../contexts/PictureDictionaryContext', () => ({
  ...jest.requireActual('../../contexts/PictureDictionaryContext'),
  usePictureDictionary: jest.fn(),
}));

describe('TransliterableText', () => {
  it('should split text into words and call openModal on click', () => {
    const openModal = jest.fn();
    usePictureDictionary.mockReturnValue({ openModal });

    render(
        <TransliterableText text="hello world" />
    );

    const word1 = screen.getByText('hello');
    const word2 = screen.getByText('world');

    expect(word1).toBeInTheDocument();
    expect(word2).toBeInTheDocument();

    fireEvent.click(word1);
    expect(openModal).toHaveBeenCalledWith('hello');

    fireEvent.click(word2);
    expect(openModal).toHaveBeenCalledWith('world');
  });
});
