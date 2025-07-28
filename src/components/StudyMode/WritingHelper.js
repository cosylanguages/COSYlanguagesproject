import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { getWritingFeedback } from '../../utils/ai/writingFeedback';
import './WritingHelper.css';

const WritingHelper = () => {
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const getFeedback = async () => {
        setIsLoading(true);
        const feedback = await getWritingFeedback(text);
        setFeedback(feedback);
        setIsLoading(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
            <Modal isOpen={isModalOpen} onClose={closeModal}>
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
            </Modal>
        </div>
    );
};

export default WritingHelper;
