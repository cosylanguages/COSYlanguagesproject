import React from 'react';
import { useParams } from 'react-router-dom';
import useVerbs from '../../../hooks/useVerbs';
import SearchableCardList from '../../Common/SearchableCardList';
import IrregularVerbCard from './IrregularVerbCard';

const IrregularVerbsTool = ({ isOpen, onClose }) => {
    const { lang } = useParams();
    const { verbs, loading, error } = useVerbs('all', lang);

    const searchFunction = (verb, searchTerm) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return verb.verb.toLowerCase().includes(lowerSearchTerm) ||
               verb.translation.toLowerCase().includes(lowerSearchTerm);
    };

    const renderVerbCard = (verb) => (
        <IrregularVerbCard verb={verb} />
    );

    if (!isOpen) {
        return null;
    }

    if (loading) return <p>Loading verbs...</p>;
    if (error) return <p>Error loading verbs: {error.message}</p>;

    return (
        <div className="tool-panel-modal">
            <div className="tool-panel-modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <h3>Irregular Verbs</h3>
                <SearchableCardList
                    items={verbs}
                    searchFunction={searchFunction}
                    renderCard={renderVerbCard}
                />
            </div>
        </div>
    );
};

export default IrregularVerbsTool;
