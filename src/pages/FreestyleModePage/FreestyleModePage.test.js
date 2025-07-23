import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FreestyleModePage from './FreestyleModePage';

// Mock the ThemedBoosterPacks component
jest.mock('../../components/Freestyle/BoosterPacks', () => {
    return function DummyBoosterPacks() {
        return <div data-testid="booster-packs"></div>;
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
        render(<I18nProvider><FreestyleModePage /></I18nProvider>);
        expect(screen.getByTestId('themed-booster-packs')).toBeInTheDocument();
    });

    it('renders the BoosterPackOfTheWeek component', () => {
        render(<I18nProvider><FreestyleModePage /></I18nProvider>);
        expect(screen.getByTestId('booster-pack-of-the-week')).toBeInTheDocument();
    });
});
