import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WritingHelper from './WritingHelper';

jest.mock('../../utils/ai/writingFeedback', () => ({
    getWritingFeedback: () => Promise.resolve([
        { message: 'Test feedback', type: 'suggestion' }
    ]),
}));

describe('WritingHelper', () => {
    it('renders the writing helper and provides feedback', async () => {
        render(<WritingHelper />);
        fireEvent.change(screen.getByPlaceholderText('Write something...'), { target: { value: 'Test input' } });
        fireEvent.click(screen.getByText('Get Feedback'));
        const feedbackElement = await screen.findByText(/Test feedback/i);
        expect(feedbackElement).toBeInTheDocument();
    });
});
