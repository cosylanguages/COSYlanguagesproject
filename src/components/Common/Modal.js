// Import necessary libraries and components.
import React, { useEffect } from 'react';
import Button from './Button';
import './Modal.css';

/**
 * A reusable modal dialog component.
 * It can be closed by clicking the close button, clicking outside the modal, or pressing the Escape key.
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onClose - A callback function to handle the closing of the modal.
 * @param {string} props.title - The title of the modal.
 * @param {object} props.children - The content of the modal.
 * @returns {JSX.Element|null} The Modal component, or null if it's not open.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    // Effect to handle the Escape key press.
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    // If the modal is not open, don't render anything.
    if (!isOpen) {
        return null;
    }

    // Render the modal.
    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {title && <h3 id="modal-title" className="modal-title">{title}</h3>}
                    <Button
                        onClick={onClose}
                        className="modal-close-button"
                        aria-label="Close modal" // Use aria-label for accessibility
                        variant="default"
                    >
                        &times;
                    </Button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
