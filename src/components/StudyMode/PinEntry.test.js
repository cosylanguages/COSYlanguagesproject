import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PinEntry from './PinEntry';

describe('PinEntry', () => {
    it('renders correctly', () => {
        render(<I18nProvider><PinEntry /></I18nProvider>);
        expect(screen.getByText('Enter PIN for Study Mode')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
    });

    it('shows an error with an invalid PIN', () => {
        render(<I18nProvider><PinEntry /></I18nProvider>);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '1111' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));
        expect(screen.getByText('Invalid PIN. Please try again.')).toBeInTheDocument();
    });

    it('calls onPinVerified with a valid PIN', () => {
        const onPinVerified = jest.fn();
        render(<I18nProvider><PinEntry onPinVerified={onPinVerified} /></I18nProvider>);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));
        expect(onPinVerified).toHaveBeenCalled();
    });
});
