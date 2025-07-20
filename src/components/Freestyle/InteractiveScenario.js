import React, { useState } from 'react';
import './InteractiveScenario.css';

const InteractiveScenario = ({ scenario, onClose }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const currentScene = scenario.scenes[currentSceneIndex];

    const handleChoice = (nextSceneIndex) => {
        if (nextSceneIndex < scenario.scenes.length) {
            setCurrentSceneIndex(nextSceneIndex);
        } else {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const checkAnswer = () => {
        if (inputValue.toLowerCase() === currentScene.blank.toLowerCase()) {
            setIsCorrect(true);
            setTimeout(() => {
                if (currentSceneIndex < scenario.scenes.length - 1) {
                    setCurrentSceneIndex(currentSceneIndex + 1);
                    setInputValue('');
                    setIsCorrect(null);
                } else {
                    onClose();
                }
            }, 1000);
        } else {
            setIsCorrect(false);
        }
    };

    if (scenario.type === 'fill-in-the-blanks') {
        return (
            <div className="interactive-scenario-modal">
                <div className="interactive-scenario-content">
                    <button onClick={onClose} className="close-button">&times;</button>
                    <h3>{scenario.title}</h3>
                    <div className="scene">
                        <p className="line">{currentScene.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
                        <input type="text" value={inputValue} onChange={handleInputChange} />
                        <button onClick={checkAnswer}>Check</button>
                        {isCorrect === true && <p className="correct">Correct!</p>}
                        {isCorrect === false && <p className="incorrect">Incorrect. Try again.</p>}
                    </div>
                </div>
            </div>
        );
    }

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
