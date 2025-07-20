import React, { useState, useEffect, useMemo } from 'react';
import './VirtualTutor.css';

const VirtualTutor = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [bot, setBot] = useState(null);
    const [personality, setPersonality] = useState('cheerful');

    const personalities = useMemo(() => ({
        cheerful: {
            greeting: 'Hello! I am your cheerful tutor. How can I help you today?',
            avatar: '😊',
        },
        calm: {
            greeting: 'Greetings. I am your calm tutor. How may I assist you?',
            avatar: '🧘',
        },
        quirky: {
            greeting: "Hey there! I'm your quirky tutor. Let's learn some stuff!",
            avatar: '🤪',
        },
    }), []);

    useEffect(() => {
        const rive = new window.RiveScript();
        rive.loadFile('/data/tutor.rive').then(() => {
            rive.sortReplies();
            setBot(rive);
            setMessages([{ text: personalities[personality].greeting, sender: 'tutor' }]);
        });
    }, [personality, personalities]);

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
            <div className="tutor-header">
                <h2>Virtual Tutor</h2>
                <div className="personality-selector">
                    <label htmlFor="personality-select">Tutor Personality:</label>
                    <select
                        id="personality-select"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                    >
                        {Object.keys(personalities).map((p) => (
                            <option key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.sender === 'tutor' && (
                            <span className="avatar">{personalities[personality].avatar}</span>
                        )}
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
