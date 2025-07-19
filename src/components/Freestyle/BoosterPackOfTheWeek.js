import React, { useState, useEffect } from 'react';
import BoosterPack from './BoosterPack';
import './BoosterPackOfTheWeek.css';

const BoosterPackOfTheWeek = () => {
    const [boosterPack, setBoosterPack] = useState(null);

    useEffect(() => {
        fetch('/data/booster_packs.json')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                setBoosterPack(data[randomIndex]);
            });
    }, []);

    if (!boosterPack) {
        return null;
    }

    return (
        <div className="booster-pack-of-the-week">
            <h2>Booster Pack of the Week</h2>
            <BoosterPack pack={boosterPack} />
        </div>
    );
};

export default BoosterPackOfTheWeek;
