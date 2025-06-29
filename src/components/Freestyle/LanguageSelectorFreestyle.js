import React from 'react';

// Actual Exercise Components
import ShowWordExercise from './exercises/vocabulary/ShowWordExercise';

// Placeholder components for exercises - these will be replaced by actual exercise components later
const PlaceholderExercise = ({ name }) => (
  <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
    <h3>{name} Exercise</h3>
    <p>This is a placeholder for the <em>{name}</em> exercise.</p>
    <p>Implementation is pending.</p>
  </div>
);

// Mapping of sub-practice IDs to their components
// This will grow as actual exercise components are developed.
const exerciseMap = {
  // Vocabulary
  'random-word': ShowWordExercise, // Use the actual component
  'random-image': () => <PlaceholderExercise name="Random Image" />,
  'listening': () => <PlaceholderExercise name="Listening" />,
  // Grammar
  'gender-articles': () => <PlaceholderExercise name="Gender & Articles" />,
  'verbs-conjugation': () => <PlaceholderExercise name="Verbs & Conjugation" />,
  'possessives': () => <PlaceholderExercise name="Possessives" />,
  // Reading
  'story': () => <PlaceholderExercise name="Story" />,
  'interesting-fact': () => <PlaceholderExercise name="Interesting Fact" />,
  // Speaking
  'question-practice': () => <PlaceholderExercise name="Speaking Question" />,
  'monologue': () => <PlaceholderExercise name="Monologue" />,
  // Writing
  'writing-question': () => <PlaceholderExercise name="Writing Question" />,
  'storytelling': () => <PlaceholderExercise name="Storytelling" />,
  // Add more mappings as exercises are developed
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>Please select an exercise type above.</p>;
  }

  const ExerciseComponent = exerciseMap[subPracticeType];

  if (!ExerciseComponent) {
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
        <h3>Exercise Error</h3>
        <p>Exercise type "<strong>{subPracticeType}</strong>" not found or not yet implemented.</p>
        <p>Please check the mapping in ExerciseHost.js or select another exercise.</p>
      </div>
    );
  }

  // Pass necessary props to the actual exercise component
  // exerciseKey is used to force re-mounting and re-fetching data if the same exercise type is selected again
  // Note: If ExerciseComponent is a functional component that returns JSX (like Placeholders),
  // it needs to be called as <ExerciseComponent /> not ExerciseComponent().
  // If it's a class component or a direct reference to a functional component (like ShowWordExercise),
  // it can be used directly as <ExerciseComponent ... />.
  // For consistency with how React handles components, direct reference is better.
  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} />;
};

export default ExerciseHost;
