// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import BoosterPack from './BoosterPack';
import InteractiveScenario from './InteractiveScenario';
import './BoosterPackOfTheWeek.css';
import UserBoosterPackCreator from './UserBoosterPackCreator';

/**
 * A component that displays a list of booster packs.
 * It also includes a user booster pack creator and handles the selection of a pack.
 * @param {object} props - The component's props.
 * @param {Array} props.boosterPacks - An array of booster packs to display.
 * @param {function} props.onSelect - A callback function to handle the selection of a pack.
 * @returns {JSX.Element} The BoosterPacks component.
 */
const BoosterPacks = ({ boosterPacks, onSelect }) => {
    // State for user-created booster packs and the currently selected pack.
    const [userBoosterPacks, setUserBoosterPacks] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);

    // Load user-created booster packs from local storage when the component mounts.
    useEffect(() => {
        const storedUserPacks = JSON.parse(localStorage.getItem('userBoosterPacks')) || [];
        setUserBoosterPacks(storedUserPacks);
    }, []);

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
            <h2>Booster Packs</h2>
            <div className="booster-packs-container">
                {boosterPacks.map(pack => (
                    <div key={pack.id} onClick={() => handlePackClick(pack)}>
                        <BoosterPack pack={pack} />
                    </div>
                ))}
            </div>

            <h2>Your Booster Packs</h2>
            <div className="booster-packs-container">
                {userBoosterPacks.map(pack => (
                    <div key={pack.id} onClick={() => handlePackClick(pack)}>
                        <BoosterPack pack={pack} />
                    </div>
                ))}
            </div>

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
