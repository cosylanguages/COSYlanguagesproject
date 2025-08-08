import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import PictureDictionary from './PictureDictionary';

jest.mock('axios');

describe('PictureDictionary', () => {
  it('should fetch and display images', async () => {
    const mockPhotos = [
      { id: 1, src: { small: 'test1.jpg' }, photographer: 'Test Photographer 1' },
      { id: 2, src: { small: 'test2.jpg' }, photographer: 'Test Photographer 2' },
    ];
    axios.get.mockResolvedValue({ data: { photos: mockPhotos } });

    render(<PictureDictionary word="test" onClose={() => {}} />);

    expect(screen.getByText('Loading images...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'test1.jpg');
    });
  });
});
