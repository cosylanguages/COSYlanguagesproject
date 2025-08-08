import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePictureDictionary } from '../../contexts/PictureDictionaryContext';
import TransliterableText from './TransliterableText';
import * as speechUtils from '../../utils/speechUtils';

jest.mock('../../contexts/PictureDictionaryContext', () => ({
  usePictureDictionary: jest.fn(),
}));
jest.mock('../../utils/speechUtils');

describe('TransliterableText', () => {
  it('should render words with pronounce and picture dictionary buttons', () => {
    const openModal = jest.fn();
    usePictureDictionary.mockReturnValue({ openModal });

    render(<TransliterableText text="hello world" />);

    const word1 = screen.getByText('hello');
    const word2 = screen.getByText('world');

    expect(word1).toBeInTheDocument();
    expect(word2).toBeInTheDocument();

    const pronounceButtons = screen.getAllByText('🔊');
    const pictureButtons = screen.getAllByText('🖼️');

    expect(pronounceButtons).toHaveLength(2);
    expect(pictureButtons).toHaveLength(2);

    fireEvent.click(pronounceButtons[0]);
    expect(speechUtils.pronounceText).toHaveBeenCalledWith('hello', expect.any(String));

    fireEvent.click(pictureButtons[1]);
    expect(openModal).toHaveBeenCalledWith('world');
  });
});
