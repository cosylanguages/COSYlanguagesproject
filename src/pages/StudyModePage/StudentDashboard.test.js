import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentDashboard from './StudentDashboard';

// Mock the SmartReview component
jest.mock('../../components/StudyMode/SmartReview', () => {
    return function DummySmartReview() {
        return <div data-testid="smart-review"></div>;
    };
});

describe('StudentDashboard', () => {
    it('renders the Smart Review button', () => {
        render(<StudentDashboard />);
        expect(screen.getByText('Smart Review')).toBeInTheDocument();
    });

    it('shows the SmartReview component when the button is clicked', () => {
        render(<StudentDashboard />);
        const button = screen.getByText('Smart Review');
        fireEvent.click(button);
        expect(screen.getByTestId('smart-review')).toBeInTheDocument();
    });
});
