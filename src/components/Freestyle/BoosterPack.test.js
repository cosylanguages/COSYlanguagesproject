import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoosterPack from './BoosterPack';

const mockPack = {
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
                        { "text": "Je voudrais un café, s'il vous plaît.", "nextScene": 1 },
                        { "text": "Un croissant, s'il vous plaît.", "nextScene": 2 }
                    ]
                }
            ]
        }
    }
};

describe('BoosterPack', () => {
    it('renders the component', () => {
        render(<BoosterPack pack={mockPack} />);
        expect(screen.getByText('Cafe Hopping in Paris')).toBeInTheDocument();
    });

    it('opens the interactive scenario when the button is clicked', () => {
        render(<BoosterPack pack={mockPack} />);
        const button = screen.getByText('Start Scenario');
        fireEvent.click(button);
        expect(screen.getByText('Ordering at the Cafe')).toBeInTheDocument();
    });
});
