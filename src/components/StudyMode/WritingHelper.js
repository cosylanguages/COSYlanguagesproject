import React, { useState } from 'react';
import { getWritingFeedback } from '../../utils/ai/writingFeedback';
import './WritingHelper.css';

const WritingHelper = () => {
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const getFeedback = async () => {
        setIsLoading(true);
        const aiFeedback = await getWritingFeedback(text);
        setFeedback(aiFeedback);
        setIsLoading(false);
    };

    return (
        <div className="writing-helper">
            <h2>Writing Helper</h2>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Write something..."
            />
            <button onClick={getFeedback} disabled={isLoading}>
                Get Feedback
            </button>
            {isLoading && <p>Getting feedback...</p>}
            {feedback.length > 0 && (
                <div className="feedback">
                    <h3>Feedback:</h3>
                    <ul>
                        {feedback.map((item, index) => (
                            <li key={index} className={`feedback-${item.type}`}>
                                {item.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WritingHelper;
