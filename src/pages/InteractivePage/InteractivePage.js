import React from 'react';
import AIConversation from '../../components/Interactive/AIConversation';
import InteractiveStory from '../../components/Interactive/InteractiveStory';
import './InteractivePage.css';

const InteractivePage = () => {
  const story = {
    title: 'A Trip to Paris',
    startScene: 'intro',
    scenes: {
      intro: {
        text: 'You arrive in Paris. What do you want to do first?',
        choices: [
          { text: 'Visit the Eiffel Tower', nextScene: 'eiffelTower' },
          { text: 'Go to a cafe', nextScene: 'cafe' },
        ],
      },
      eiffelTower: {
        text: 'You see the magnificent Eiffel Tower. It is beautiful.',
        choices: [{ text: 'Go back', nextScene: 'intro' }],
      },
      cafe: {
        text: 'You order a coffee. The waiter is friendly.',
        choices: [{ text: 'Go back', nextScene: 'intro' }],
      },
    },
  };

  return (
    <div className="interactive-page">
      <h1>Interactive Exercises</h1>
      <AIConversation />
      <InteractiveStory story={story} />
    </div>
  );
};

export default InteractivePage;
