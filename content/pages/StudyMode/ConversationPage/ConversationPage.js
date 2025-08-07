import React, { useState } from 'react';
import './ConversationPage.css';

function ConversationPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse;
      const lowerCaseInput = inputValue.toLowerCase();

      if (lowerCaseInput.includes('hello')) {
        aiResponse = { text: 'Hello there! How can I help you today?', sender: 'ai' };
      } else if (lowerCaseInput.includes('how are you')) {
        aiResponse = { text: 'I am just a bot, but I am doing great! Thanks for asking.', sender: 'ai' };
      } else if (lowerCaseInput.includes('bye')) {
        aiResponse = { text: 'Goodbye! Have a great day!', sender: 'ai' };
      } else {
        aiResponse = { text: `I am not sure how to respond to that.`, sender: 'ai' };
      }

      setMessages([...newMessages, aiResponse]);
    }, 1000);
  };

  return (
    <div className="conversation-page">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ConversationPage;
