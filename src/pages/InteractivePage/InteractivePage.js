import React, { useState } from 'react';
import AIConversation from '../../components/Interactive/AIConversation';
import InteractiveStory from '../../components/Interactive/InteractiveStory';
import SpeechRecognition from '../../components/Speech/SpeechRecognition';
import './InteractivePage.css';

const InteractivePage = () => {
  const [spokenText, setSpokenText] = useState('');

  const handleSpeech = (text) => {
    setSpokenText(text);
  };

  const stories = [
    {
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
    },
    {
      title: 'A Mystery in London',
      startScene: 'start',
      scenes: {
        start: {
          text: 'You are a detective in London. A new case has just arrived. Do you accept it?',
          choices: [
            { text: 'Yes', nextScene: 'caseAccepted' },
            { text: 'No', nextScene: 'caseRejected' },
          ],
        },
        caseAccepted: {
          text: 'You start investigating the case. It leads you to a dark alley.',
          choices: [{ text: 'Go back', nextScene: 'start' }],
        },
        caseRejected: {
          text: 'You decide to take a day off. You go to a park.',
          choices: [{ text: 'Go back', nextScene: 'start' }],
        },
      },
    },
  ];

  return (
    <div className="interactive-page">
      <h1>Interactive Exercises</h1>
      <SpeechRecognition onSpeech={handleSpeech} />
      <p>You said: {spokenText}</p>
      <AIConversation />
      {stories.map((story, index) => (
        <InteractiveStory key={index} story={story} />
      ))}
    </div>
  );
};

export default InteractivePage;
