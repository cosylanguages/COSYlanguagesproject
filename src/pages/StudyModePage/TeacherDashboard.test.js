import React from 'react';
import { render, screen, fireEvent } from '../../../testUtils';
import '@testing-library/jest-dom';
import TeacherDashboard from './TeacherDashboard';

jest.mock('../../components/StudyMode/VirtualTutorTeacherView', () => {
    return function DummyVirtualTutorTeacherView() {
        return <div data-testid="virtual-tutor-teacher-view"></div>;
    };
});

describe('TeacherDashboard', () => {
    it('renders the Virtual Tutor button', () => {
        render(<TeacherDashboard />);
        expect(screen.getByText('Virtual Tutor')).toBeInTheDocument();
    });

    it('shows the VirtualTutorTeacherView component when the button is clicked', () => {
        render(<TeacherDashboard />);
        const button = screen.getByText('Virtual Tutor');
        fireEvent.click(button);
        expect(screen.getByTestId('virtual-tutor-teacher-view')).toBeInTheDocument();
    });
});
