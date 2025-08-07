import React from 'react';
import Modal from './Modal';
import { useI18n } from '../../i18n/I18nContext';

const HelpModal = ({ title, content, isOpen, onClose }) => {
    const { t } = useI18n();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>{t(title)}</h2>
            <p>{t(content)}</p>
        </Modal>
    );
};

export default HelpModal;
