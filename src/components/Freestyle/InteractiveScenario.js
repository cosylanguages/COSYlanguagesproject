import React, { useState } from 'react';
import './InteractiveScenario.css';

const InteractiveScenario = ({ scenario, onClose }) => {
    const [currentScene, setCurrentScene] = useState(scenario.scenes[0]);

    const handleChoice = (nextSceneIndex) => {
        if (nextSceneIndex < scenario.scenes.length) {
            setCurrentScene(scenario.scenes[nextSceneIndex]);
        } else {
            onClose();
        }
    };

    return (
        <div className="interactive-scenario-modal">
            <div className="interactive-scenario-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <h3>{scenario.title}</h3>
                <div className="scene">
                    <p className="character">{currentScene.character}</p>
                    <p className="line">{currentScene.line}</p>
                </div>
                <div className="choices">
                    {currentScene.choices.map((choice, index) => (
                        <button key={index} onClick={() => handleChoice(choice.nextScene)}>
                            {choice.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InteractiveScenario;
