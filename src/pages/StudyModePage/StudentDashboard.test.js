import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentDashboard from './StudentDashboard';

// Mock the MistakeNotebook component
jest.mock('../../components/StudyMode/MistakeNotebook', () => {
    return function DummyMistakeNotebook() {
        return <div data-testid="mistake-notebook"></div>;
    };
});

describe('StudentDashboard', () => {
    it('renders the Mistake Notebook button', () => {
        render(<StudentDashboard />);
        expect(screen.getByText('Mistake Notebook')).toBeInTheDocument();
    });

    it('shows the MistakeNotebook component when the button is clicked', () => {
        render(<StudentDashboard />);
        const button = screen.getByText('Mistake Notebook');
        fireEvent.click(button);
        expect(screen.getByTestId('mistake-notebook')).toBeInTheDocument();
    });
});
