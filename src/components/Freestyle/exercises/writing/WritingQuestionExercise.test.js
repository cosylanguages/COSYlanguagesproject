import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WritingQuestionExercise from './WritingQuestionExercise';
import { I18nProvider } from '../../../../i18n/I18nContext';

jest.mock('../../../StudyMode/WritingHelper', () => {
    return function DummyWritingHelper({ onTextChange }) {
        return <textarea data-testid="writing-helper" onChange={(e) => onTextChange(e.target.value)}></textarea>;
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        lang: 'en',
    }),
}));

describe('WritingQuestionExercise', () => {
    it('renders the WritingHelper component', () => {
        render(
            <I18nProvider>
                <MemoryRouter>
                    <WritingQuestionExercise language="en" days={['1']} />
                </MemoryRouter>
            </I18nProvider>
        );
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
