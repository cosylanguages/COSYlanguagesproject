import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PinEntry from './PinEntry';

describe('PinEntry', () => {
    it('renders correctly', () => {
        render(<PinEntry />);
        expect(screen.getByText('Enter PIN for Study Mode')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
    });

    it('shows an error with an invalid PIN', () => {
        render(<PinEntry />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '1111' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));
        expect(screen.getByText('Invalid PIN. Please try again.')).toBeInTheDocument();
    });

    it('calls onPinVerified with a valid PIN', () => {
        const onPinVerified = jest.fn();
        render(<PinEntry onPinVerified={onPinVerified} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));
        expect(onPinVerified).toHaveBeenCalled();
    });
});
