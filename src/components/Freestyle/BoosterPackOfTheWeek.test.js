import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BoosterPackOfTheWeek from './BoosterPackOfTheWeek';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            {
                "id": 1,
                "title": "Cafe Hopping in Paris",
                "description": "Learn how to order coffee and pastries in a Parisian cafe.",
                "content": {
                    "scenario": {
                        "title": "Ordering at the Cafe",
                        "scenes": [
                            {
                                "character": "Waiter",
                                "line": "Bonjour ! Qu'est-ce que vous voulez ?",
                                "choices": [
                                    { "text": "Je voudrais un café, s'il vous plaît.", "nextScene": 1 }
                                ]
                            },
                            {
                                "character": "Waiter",
                                "line": "Voilà un café. Autre chose ?",
                                "choices": [
                                    { "text": "Non, merci. C'est tout.", "nextScene": 2 }
                                ]
                            }
                        ]
                    }
                }
            }
        ]),
    })
);

describe('BoosterPackOfTheWeek', () => {
    it('renders the booster pack of the week', async () => {
        render(<BoosterPackOfTheWeek />);
        await waitFor(() => {
            expect(screen.getByText('Cafe Hopping in Paris')).toBeInTheDocument();
        });
    });

    it('shows the interactive scenario when the button is clicked', async () => {
        render(<BoosterPackOfTheWeek />);
        await waitFor(() => {
            fireEvent.click(screen.getByText('Start Scenario'));
        });
        await waitFor(() => {
            expect(screen.getByText('Ordering at the Cafe')).toBeInTheDocument();
        });
    });

    it('shows the completion badge when the scenario is closed', async () => {
        render(<BoosterPackOfTheWeek />);
        await waitFor(() => {
            fireEvent.click(screen.getByText('Start Scenario'));
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('×'));
        });
        await waitFor(() => {
            expect(screen.getByText('Completed!')).toBeInTheDocument();
        });
    });
});
