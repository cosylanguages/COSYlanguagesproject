import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './TryStudyModeButton.css';

const TryStudyModeButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentUser } = useAuth();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <button onClick={handleOpenModal} className="try-study-mode-button">
                Try Study Mode
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2>Unlock Your Full Potential with Study Mode!</h2>
                <p>Study Mode is a focused learning environment with powerful features to boost your progress:</p>
                <ul>
                    <li>Structured roadmaps to guide your learning journey.</li>
                    <li>Personalized flashcard decks for smart revision.</li>
                    <li>In-depth grammar explanations and exercises.</li>
                    <li>And much more!</li>
                </ul>
                {currentUser ? (
                    <Link to="/study" className="modal-cta-button">Go to Study Mode</Link>
                ) : (
                    <div className="modal-auth-buttons">
                        <Link to="/login" className="modal-cta-button">Login</Link>
                        <Link to="/signup" className="modal-cta-button">Sign Up</Link>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default TryStudyModeButton;
