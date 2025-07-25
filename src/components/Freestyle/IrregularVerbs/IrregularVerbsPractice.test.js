import React from 'react';
import { render, screen, fireEvent } from '../../../../testUtils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import IrregularVerbsPractice from './IrregularVerbsPractice';
import { useVerbs } from '../../../hooks/useVerbs';

jest.mock('../../../hooks/useVerbs');

const mockVerbs = [
    { base: 'go', pastSimple: 'went', pastParticiple: 'gone', definition: 'to move', example: 'I went to the store.' },
    { base: 'eat', pastSimple: 'ate', pastParticiple: 'eaten', definition: 'to consume food', example: 'I ate a sandwich.' },
];

describe('IrregularVerbsPractice', () => {
    it('renders the level selector when no levels are selected', () => {
        useVerbs.mockReturnValue({ verbs: [], loading: false, error: null });
        render(
            <MemoryRouter initialEntries={['/study/irregular-verbs']}>
                <Routes>
                    <Route path="/study/irregular-verbs" element={<IrregularVerbsPractice />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Select Irregular Verb Levels')).toBeInTheDocument();
    });

    it('renders the practice component when levels are selected', () => {
        useVerbs.mockReturnValue({ verbs: mockVerbs, loading: false, error: null });
        render(
            <MemoryRouter initialEntries={['/study/irregular-verbs/practice?levels=a1&variety=all']}>
                <Routes>
                    <Route path="/study/irregular-verbs/practice" element={<IrregularVerbsPractice />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Irregular Verbs Practice')).toBeInTheDocument();
        expect(screen.getByText('go')).toBeInTheDocument();
    });

    it('goes to the next verb when the next button is clicked', () => {
        useVerbs.mockReturnValue({ verbs: mockVerbs, loading: false, error: null });
        render(
            <MemoryRouter initialEntries={['/study/irregular-verbs/practice?levels=a1&variety=all']}>
                <Routes>
                    <Route path="/study/irregular-verbs/practice" element={<IrregularVerbsPractice />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('go')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('eat')).toBeInTheDocument();
    });
});
