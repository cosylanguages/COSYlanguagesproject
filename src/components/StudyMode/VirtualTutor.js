import React, { useState } from 'react';
import './VirtualTutor.css';

const VirtualTutor = () => {
    const [messages, setMessages] = useState([
        { text: 'Hello! I am your virtual tutor. How can I help you today?', sender: 'tutor' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const newMessages = [...messages, { text: inputValue, sender: 'user' }];
        setMessages(newMessages);
        setInputValue('');

        // Mock tutor response
        setTimeout(() => {
            const tutorResponse = { text: 'That is a great question! Let me explain...', sender: 'tutor' };
            setMessages([...newMessages, tutorResponse]);
        }, 1000);
    };

    return (
        <div className="virtual-tutor">
            <h2>Virtual Tutor</h2>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ask a question..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default VirtualTutor;
