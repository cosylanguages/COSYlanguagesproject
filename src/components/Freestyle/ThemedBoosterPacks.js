import React, { useState, useEffect } from 'react';
import BoosterPack from './BoosterPack';
import './ThemedBoosterPacks.css';

const ThemedBoosterPacks = () => {
    const [boosterPacks, setBoosterPacks] = useState([]);

    useEffect(() => {
        fetch('/data/booster_packs.json')
            .then(response => response.json())
            .then(data => setBoosterPacks(data));
    }, []);

    return (
        <div className="themed-booster-packs">
            <h2>Themed Booster Packs</h2>
            <div className="booster-packs-container">
                {boosterPacks.map(pack => (
                    <BoosterPack key={pack.id} pack={pack} />
                ))}
            </div>
        </div>
    );
};

export default ThemedBoosterPacks;
