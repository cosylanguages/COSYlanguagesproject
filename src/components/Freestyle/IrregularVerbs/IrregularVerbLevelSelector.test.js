import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IrregularVerbLevelSelector from './IrregularVerbLevelSelector';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('IrregularVerbLevelSelector', () => {
    it('renders the component', () => {
        render(
            <MemoryRouter>
                <IrregularVerbLevelSelector />
            </MemoryRouter>
        );
        expect(screen.getByText('Select Irregular Verb Levels')).toBeInTheDocument();
    });

    it('selects a level when a level button is clicked', () => {
        render(
            <MemoryRouter>
                <IrregularVerbLevelSelector />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('A1'));
        expect(screen.getByText('A1')).toHaveClass('selected');
    });

    it('navigates to the practice page when the start button is clicked', () => {
        render(
            <MemoryRouter>
                <IrregularVerbLevelSelector />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('A1'));
        fireEvent.click(screen.getByText('Start Practice'));
        expect(mockedNavigate).toHaveBeenCalledWith('/study/irregular-verbs/practice?levels=a1&variety=all');
    });
});
