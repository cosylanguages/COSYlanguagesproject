import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberPracticeExercise from './NumberPracticeExercise';
import { I18nContext } from '../../../../i18n/I18nContext';

const mockT = (key, fallback) => fallback || key;

const renderWithI18n = (component) => {
    return render(
        <I18nContext.Provider value={{ t: mockT, language: 'en' }}>
            {component}
        </I18nContext.Provider>
    );
};

describe('NumberPracticeExercise', () => {
    it('renders the component', () => {
        renderWithI18n(<NumberPracticeExercise language="en" />);
        expect(screen.getByText('Number Practice')).toBeInTheDocument();
    });

    it('displays a number', () => {
        renderWithI18n(<NumberPracticeExercise language="en" />);
        const numberDisplay = screen.getByText(/[0-9]+/);
        expect(numberDisplay).toBeInTheDocument();
    });

    it('allows the user to type an answer', () => {
        renderWithI18n(<NumberPracticeExercise language="en" />);
        const input = screen.getByPlaceholderText('Type the number in words');
        fireEvent.change(input, { target: { value: 'one hundred' } });
        expect(input.value).toBe('one hundred');
    });

    it('provides feedback on the answer', () => {
        renderWithI18n(<NumberPracticeExercise language="en" />);
        const checkButton = screen.getByText('✔️ Check');
        fireEvent.click(checkButton);
        const feedback = screen.getByText('Incorrect, try again.');
        expect(feedback).toBeInTheDocument();
    });

    it('generates a new number when the next button is clicked', () => {
        renderWithI18n(<NumberPracticeExercise language="en" />);
        const numberDisplay1 = screen.getByText(/[0-9]+/).textContent;
        const nextButton = screen.getByText('➡️ Next Exercise');
        fireEvent.click(nextButton);
        const numberDisplay2 = screen.getByText(/[0-9]+/).textContent;
        expect(numberDisplay1).not.toBe(numberDisplay2);
    });
});
