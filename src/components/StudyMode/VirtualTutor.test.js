import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../testUtils';
import VirtualTutor from './VirtualTutor';

global.RiveScript = jest.fn(() => ({
    loadFile: jest.fn().mockResolvedValue(),
    sortReplies: jest.fn(),
    reply: jest.fn().mockResolvedValue('Test reply'),
}));

describe('VirtualTutor', () => {
    it('renders the virtual tutor and allows sending messages', async () => {
        render(<VirtualTutor />);
        fireEvent.change(screen.getByPlaceholderText('Ask a question...'), { target: { value: 'Test question' } });
        fireEvent.click(screen.getByText('Send'));
        await waitFor(() => {
            expect(screen.getByText('Test question')).toBeInTheDocument();
            expect(screen.getByText('That is a great question! Let me explain...')).toBeInTheDocument();
        });
    });
});
