import React, { useState } from 'react';
import './WritingHelper.css';

const WritingHelper = ({ onTextChange }) => {
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState([]);

    const handleChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        onTextChange(newText);
        // In a real app, we would call a grammar and style checking service here
        // For now, we'll just use a placeholder
        const newFeedback = [
            { message: 'This is a placeholder for feedback.', type: 'info' }
        ];
        setFeedback(newFeedback);
    };

    return (
        <div className="writing-helper">
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Write your text here..."
            />
            <div className="feedback-container">
                {feedback.map((item, index) => (
                    <div key={index} className={`feedback-item ${item.type}`}>
                        {item.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WritingHelper;
