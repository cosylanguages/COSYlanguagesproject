// Import necessary libraries and components.
import React, { useState } from 'react';
import './InteractiveScenario.css';

/**
 * A component that implements an interactive scenario.
 * The scenario can be a "choose your own adventure" style scenario or a "fill in the blanks" exercise.
 * @param {object} props - The component's props.
 * @param {object} props.scenario - The scenario data.
 * @param {function} props.onClose - A callback function to handle the closing of the scenario.
 * @returns {JSX.Element} The InteractiveScenario component.
 */
const InteractiveScenario = ({ scenario, onClose }) => {
    // State for the current scene index, input value, and whether the answer is correct.
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const currentScene = scenario.scenes[currentSceneIndex];

    /**
     * Handles the selection of a choice in a "choose your own adventure" scenario.
     * @param {number} nextSceneIndex - The index of the next scene.
     */
    const handleChoice = (nextSceneIndex) => {
        if (nextSceneIndex < scenario.scenes.length) {
            setCurrentSceneIndex(nextSceneIndex);
        } else {
            onClose();
        }
    };

    /**
     * Handles the change of the input value in a "fill in the blanks" exercise.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    /**
     * Checks the answer in a "fill in the blanks" exercise.
     */
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

    // If the scenario is a "fill in the blanks" exercise, render the fill in the blanks view.
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

    // Otherwise, render the "choose your own adventure" view.
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
