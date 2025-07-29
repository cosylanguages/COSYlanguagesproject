// Import necessary libraries and components.
import React, { useState } from 'react';
import BoosterPack from './BoosterPack';
import InteractiveScenario from './InteractiveScenario';
import './BoosterPackOfTheWeek.css';
import UserBoosterPackCreator from './UserBoosterPackCreator';
import { useBoosterPacks } from '../../hooks/useBoosterPacks';

const BoosterPackList = ({ title, packs, onPackClick }) => (
    <div className="booster-packs-section">
        <h2>{title}</h2>
        <div className="booster-packs-container">
            {packs.map(pack => (
                <div key={pack.id} onClick={() => onPackClick(pack)}>
                    <BoosterPack pack={pack} />
                </div>
            ))}
        </div>
    </div>
);

/**
 * A component that displays a list of booster packs.
 * It also includes a user booster pack creator and handles the selection of a pack.
 * @param {object} props - The component's props.
 * @param {function} props.onSelect - A callback function to handle the selection of a pack.
 * @returns {JSX.Element} The BoosterPacks component.
 */
const BoosterPacks = ({ onSelect }) => {
    const { boosterPacks, userBoosterPacks } = useBoosterPacks();
    const [selectedPack, setSelectedPack] = useState(null);

    /**
     * Handles the click of a booster pack.
     * @param {object} pack - The clicked booster pack.
     */
    const handlePackClick = (pack) => {
        setSelectedPack(pack);
        if (onSelect) {
            onSelect(pack);
        }
    };

    /**
     * Handles the closing of the interactive scenario.
     */
    const handleCloseScenario = () => {
        setSelectedPack(null);
    };

    // Render the booster packs component.
    return (
        <div className="booster-packs">
            <UserBoosterPackCreator />
            <BoosterPackList title="Booster Packs" packs={boosterPacks} onPackClick={handlePackClick} />
            <BoosterPackList title="Your Booster Packs" packs={userBoosterPacks} onPackClick={handlePackClick} />

            {/* If a pack with a scenario is selected, render the interactive scenario. */}
            {selectedPack && selectedPack.content.scenario && (
                <InteractiveScenario
                    scenario={selectedPack.content.scenario}
                    onClose={handleCloseScenario}
                />
            )}
        </div>
    );
};

export default BoosterPacks;
