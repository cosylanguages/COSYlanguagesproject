import React from 'react';
import useVerbs from '../../../hooks/useVerbs';
import SearchableCardList from '../../Common/SearchableCardList';
import IrregularVerbCard from './IrregularVerbCard';
import Modal from '../../Common/Modal';
import { useI18n } from '../../../i18n/I18nContext';

const IrregularVerbsTool = ({ isOpen, onClose }) => {
    const { t, language } = useI18n();
    const { verbs, loading, error } = useVerbs('all', language);

    const searchFunction = (verb, searchTerm) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return verb.verb.toLowerCase().includes(lowerSearchTerm) ||
               verb.translation.toLowerCase().includes(lowerSearchTerm);
    };

    const renderVerbCard = (verb) => (
        <IrregularVerbCard verb={verb} />
    );

    if (loading) return <p>Loading verbs...</p>;
    if (error) return <p>Error loading verbs: {error.message}</p>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('studyMode.toolIrregularVerbs', 'Irregular Verbs')}>
            <SearchableCardList
                items={verbs}
                searchFunction={searchFunction}
                renderCard={renderVerbCard}
            />
        </Modal>
    );
};

export default IrregularVerbsTool;
