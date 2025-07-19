import React, { useState } from 'react';
import InteractiveScenario from './InteractiveScenario';
import './BoosterPack.css';

const BoosterPack = ({ pack }) => {
    const [isScenarioVisible, setIsScenarioVisible] = useState(false);

    return (
        <div className="booster-pack">
            <h3>{pack.title}</h3>
            <p>{pack.description}</p>
            <button onClick={() => setIsScenarioVisible(true)}>Start Scenario</button>
            {isScenarioVisible && (
                <InteractiveScenario
                    scenario={pack.content.scenario}
                    onClose={() => setIsScenarioVisible(false)}
                />
            )}
        </div>
    );
};

export default BoosterPack;
