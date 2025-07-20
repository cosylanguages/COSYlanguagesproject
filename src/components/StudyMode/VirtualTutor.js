import React, { useState, useEffect } from 'react';
import './VirtualTutor.css';

const VirtualTutor = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [bot, setBot] = useState(null);

    useEffect(() => {
        const rive = new window.RiveScript();
        rive.loadFile('/data/tutor.rive').then(() => {
            rive.sortReplies();
            setBot(rive);
            setMessages([{ text: 'Hello! I am your virtual tutor. How can I help you today?', sender: 'tutor' }]);
        });
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || !bot) return;

        const newMessages = [...messages, { text: inputValue, sender: 'user' }];
        setMessages(newMessages);
        setInputValue('');

        const reply = await bot.reply('local-user', inputValue);
        setMessages([...newMessages, { text: reply, sender: 'tutor' }]);
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default VirtualTutor;
