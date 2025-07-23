import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import StudyModeGuard from './StudyModeGuard';

jest.mock('./PinEntry', () => ({ onPinVerified }) => (
    <div>
        <button onClick={onPinVerified}>Verify Pin</button>
    </div>
));

describe('StudyModeGuard', () => {
    it('renders PinEntry when pin is not verified', () => {
        render(<I18nProvider><StudyModeGuard><div>Protected Content</div></StudyModeGuard></I18nProvider>);
        expect(screen.getByText('Verify Pin')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when pin is verified', () => {
        render(<I18nProvider><StudyModeGuard><div>Protected Content</div></StudyModeGuard></I18nProvider>);
        fireEvent.click(screen.getByText('Verify Pin'));
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(screen.queryByText('Verify Pin')).not.toBeInTheDocument();
    });
});
