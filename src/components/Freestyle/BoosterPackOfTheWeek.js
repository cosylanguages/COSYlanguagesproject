import React, { useState, useEffect } from 'react';
import BoosterPack from './BoosterPack';
import InteractiveScenario from './InteractiveScenario';
import './BoosterPackOfTheWeek.css';

const BoosterPackOfTheWeek = () => {
    const [boosterPack, setBoosterPack] = useState(null);
    const [showScenario, setShowScenario] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        fetch('/data/booster_packs.json')
            .then(response => response.json())
            .then(data => {
                const getWeekNumber = (date) => {
                    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
                    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                };
                const weekNumber = getWeekNumber(new Date());
                const packIndex = (weekNumber - 1) % data.length;
                setBoosterPack(data[packIndex]);
            });
    }, []);

    const handleScenarioClose = () => {
        setShowScenario(false);
        setCompleted(true);
    };

    if (!boosterPack) {
        return null;
    }

    return (
        <div className="booster-pack-of-the-week">
            <div className="booster-pack-header">
                <h2>Booster Pack of the Week</h2>
                {completed && <span className="badge">Completed!</span>}
            </div>
            <BoosterPack pack={boosterPack} />
            <button onClick={() => setShowScenario(true)}>Start Scenario</button>
            {showScenario && (
                <InteractiveScenario
                    scenario={boosterPack.content.scenario}
                    onClose={handleScenarioClose}
                />
            )}
        </div>
    );
};

export default BoosterPackOfTheWeek;
