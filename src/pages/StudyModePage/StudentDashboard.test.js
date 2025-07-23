import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nProvider } from '../../i18n/I18nContext';
import StudentDashboard from './StudentDashboard';

// Mock the MistakeNotebook component
jest.mock('../../components/StudyMode/MistakeNotebook', () => {
    return function DummyMistakeNotebook() {
        return <div data-testid="mistake-notebook"></div>;
    };
});

// Mock the GrammarReview component
jest.mock('../../components/StudyMode/GrammarReview', () => {
    return function DummyGrammarReview() {
        return <div data-testid="grammar-review"></div>;
    };
});

// Mock the VirtualTutor component
jest.mock('../../components/StudyMode/VirtualTutor', () => {
    return function DummyVirtualTutor() {
        return <div data-testid="virtual-tutor"></div>;
    };
});

// Mock the SmartReview component
jest.mock('../../components/StudyMode/SmartReview', () => {
    return function DummySmartReview() {
        return <div data-testid="smart-review"></div>;
    };
});

const mockT = jest.fn((key, fallback) => fallback || key);

const renderWithProvider = (component) => {
    return render(
        <I18nProvider>
            {component}
        </I18nProvider>
    );
}

describe('StudentDashboard', () => {
    it('renders the Mistake Notebook button', () => {
        renderWithProvider(<StudentDashboard />);
        expect(screen.getByText('Mistake Notebook')).toBeInTheDocument();
    });

    it('shows the MistakeNotebook component when the button is clicked', () => {
        renderWithProvider(<StudentDashboard />);
        const button = screen.getByText('Mistake Notebook');
        fireEvent.click(button);
        expect(screen.getByTestId('mistake-notebook')).toBeInTheDocument();
    });

    it('renders the Grammar Review button', () => {
        renderWithProvider(<StudentDashboard />);
        expect(screen.getByText('Grammar Review')).toBeInTheDocument();
    });

    it('shows the GrammarReview component when the button is clicked', () => {
        renderWithProvider(<StudentDashboard />);
        const button = screen.getByText('Grammar Review');
        fireEvent.click(button);
        expect(screen.getByTestId('grammar-review')).toBeInTheDocument();
    });

    it('renders the Virtual Tutor button', () => {
        renderWithProvider(<StudentDashboard />);
        expect(screen.getByText('Virtual Tutor')).toBeInTheDocument();
    });

    it('shows the VirtualTutor component when the button is clicked', () => {
        renderWithProvider(<StudentDashboard />);
        const button = screen.getByText('Virtual Tutor');
        fireEvent.click(button);
        expect(screen.getByTestId('virtual-tutor')).toBeInTheDocument();
    });

    it('renders the Smart Review button', () => {
        renderWithProvider(<StudentDashboard />);
        expect(screen.getByText('Smart Review')).toBeInTheDocument();
    });

    it('shows the SmartReview component when the button is clicked', () => {
        renderWithProvider(<StudentDashboard />);
        const button = screen.getByText('Smart Review');
        fireEvent.click(button);
        expect(screen.getByTestId('smart-review')).toBeInTheDocument();
    });
});
