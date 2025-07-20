import React, { useState, useEffect } from 'react';
import BoosterPack from './BoosterPack';
import InteractiveScenario from './InteractiveScenario';
import './BoosterPackOfTheWeek.css';
import UserBoosterPackCreator from './UserBoosterPackCreator';

const BoosterPacks = () => {
    const [boosterPacks, setBoosterPacks] = useState([]);
    const [userBoosterPacks, setUserBoosterPacks] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);

    useEffect(() => {
        fetch('/data/booster_packs.json')
            .then(response => response.json())
            .then(data => {
                setBoosterPacks(data);
            });
        const storedUserPacks = JSON.parse(localStorage.getItem('userBoosterPacks')) || [];
        setUserBoosterPacks(storedUserPacks);
    }, []);

    const handlePackClick = (pack) => {
        setSelectedPack(pack);
    };

    const handleCloseScenario = () => {
        setSelectedPack(null);
    };

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
