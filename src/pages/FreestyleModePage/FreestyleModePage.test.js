import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FreestyleModePage from './FreestyleModePage';

// Mock the ThemedBoosterPacks component
jest.mock('../../components/Freestyle/ThemedBoosterPacks', () => {
    return function DummyThemedBoosterPacks() {
        return <div data-testid="themed-booster-packs"></div>;
    };
});

// Mock the BoosterPackOfTheWeek component
jest.mock('../../components/Freestyle/BoosterPackOfTheWeek', () => {
    return function DummyBoosterPackOfTheWeek() {
        return <div data-testid="booster-pack-of-the-week"></div>;
    };
});

describe('FreestyleModePage', () => {
    it('renders the ThemedBoosterPacks component', () => {
        render(<FreestyleModePage />);
        expect(screen.getByTestId('themed-booster-packs')).toBeInTheDocument();
    });

    it('renders the BoosterPackOfTheWeek component', () => {
        render(<FreestyleModePage />);
        expect(screen.getByTestId('booster-pack-of-the-week')).toBeInTheDocument();
    });
});
