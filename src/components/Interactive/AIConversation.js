import React, { useState } from 'react';
import './AIConversation.css';

const AIConversation = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: 'That is interesting!', sender: 'ai' }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="ai-conversation">
      <h3>AI Conversation</h3>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default AIConversation;
