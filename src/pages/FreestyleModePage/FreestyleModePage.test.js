import React from 'react';
import { render, screen } from '../../../testUtils';
import '@testing-library/jest-dom';
import FreestyleModePage from './FreestyleModePage';

jest.mock('../../components/Freestyle/BoosterPacks', () => {
    return function DummyBoosterPacks() {
        return <div data-testid="booster-packs"></div>;
    };
});

jest.mock(
    '../../components/Freestyle/BoosterPackOfTheWeek',
    () => () => <div data-testid="booster-pack-of-the-week" />,
    { virtual: true }
);

describe('FreestyleModePage', () => {
    it('renders the BoosterPacks and BoosterPackOfTheWeek components', () => {
        render(<FreestyleModePage />);
        expect(screen.getByTestId('booster-packs')).toBeInTheDocument();
        expect(screen.getByTestId('booster-pack-of-the-week')).toBeInTheDocument();
    });
});
