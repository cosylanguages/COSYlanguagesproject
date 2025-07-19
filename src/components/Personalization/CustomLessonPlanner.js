import React, { useState } from 'react';
import './CustomLessonPlanner.css';

const CustomLessonPlanner = ({ onSavePlan }) => {
  const [planName, setPlanName] = useState('');
  const [topics, setTopics] = useState([]);

  const handleAddTopic = () => {
    setTopics([...topics, '']);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleSave = () => {
    onSavePlan({ name: planName, topics });
  };

  return (
    <div className="custom-lesson-planner">
      <h3>Create Your Lesson Plan</h3>
      <input
        type="text"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
        placeholder="Lesson Plan Name"
      />
      {topics.map((topic, index) => (
        <input
          key={index}
          type="text"
          value={topic}
          onChange={(e) => handleTopicChange(index, e.target.value)}
          placeholder={`Topic ${index + 1}`}
        />
      ))}
      <button onClick={handleAddTopic}>Add Topic</button>
      <button onClick={handleSave}>Save Plan</button>
    </div>
  );
};

export default CustomLessonPlanner;
