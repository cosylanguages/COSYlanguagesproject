import React, { useState } from 'react';
import './InteractiveStory.css';

const InteractiveStory = ({ story }) => {
  const [currentScene, setCurrentScene] = useState(story.startScene);

  const handleChoice = (sceneId) => {
    setCurrentScene(sceneId);
  };

  const scene = story.scenes[currentScene];

  return (
    <div className="interactive-story">
      <h3>{story.title}</h3>
      <p>{scene.text}</p>
      <div className="choices">
        {scene.choices.map((choice, index) => (
          <button key={index} onClick={() => handleChoice(choice.nextScene)}>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InteractiveStory;
