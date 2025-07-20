import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveScenario from './InteractiveScenario';

const mockScenario = {
    "title": "Ordering at the Cafe",
    "scenes": [
        {
            "character": "Waiter",
            "line": "Bonjour ! Qu'est-ce que vous voulez ?",
            "choices": [
                { "text": "Je voudrais un café, s'il vous plaît.", "nextScene": 1 },
                { "text": "Un croissant, s'il vous plaît.", "nextScene": 2 }
            ]
        },
        {
            "character": "Waiter",
            "line": "Voilà un café. Autre chose ?",
            "choices": [
                { "text": "Non, merci. C'est tout.", "nextScene": 3 },
                { "text": "Oui, je voudrais aussi un croissant.", "nextScene": 2 }
            ]
        }
    ]
};

describe('InteractiveScenario', () => {
    it('renders the component', () => {
        render(<InteractiveScenario scenario={mockScenario} onClose={() => {}} />);
        expect(screen.getByText('Ordering at the Cafe')).toBeInTheDocument();
    });

    it('renders the first scene', () => {
        render(<InteractiveScenario scenario={mockScenario} onClose={() => {}} />);
        expect(screen.getByText("Bonjour ! Qu'est-ce que vous voulez ?")).toBeInTheDocument();
    });

    it('changes the scene when a choice is clicked', () => {
        render(<InteractiveScenario scenario={mockScenario} onClose={() => {}} />);
        const choice = screen.getByText("Je voudrais un café, s'il vous plaît.");
        fireEvent.click(choice);
        expect(screen.getByText("Voilà un café. Autre chose ?")).toBeInTheDocument();
    });
});
