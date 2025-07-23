import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeacherDashboard from './TeacherDashboard';

// Mock the VirtualTutorTeacherView component
jest.mock('../../components/StudyMode/VirtualTutorTeacherView', () => {
    return function DummyVirtualTutorTeacherView() {
        return <div data-testid="virtual-tutor-teacher-view"></div>;
    };
});

import { I18nProvider } from '../../i18n/I18nContext';

const mockT = jest.fn((key, fallback) => fallback || key);

const renderWithProvider = (component) => {
    return render(
        <I18nProvider i18n={{ t: mockT, language: 'en' }}>
            {component}
        </I18nProvider>
    );
}

describe('TeacherDashboard', () => {
    it('renders the Virtual Tutor button', () => {
        renderWithProvider(<TeacherDashboard />);
        expect(screen.getByText('Virtual Tutor')).toBeInTheDocument();
    });

    it('shows the VirtualTutorTeacherView component when the button is clicked', () => {
        renderWithProvider(<TeacherDashboard />);
        const button = screen.getByText('Virtual Tutor');
        fireEvent.click(button);
        expect(screen.getByTestId('virtual-tutor-teacher-view')).toBeInTheDocument();
    });
});
