import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './IrregularVerbCard.css';

const IrregularVerbCard = ({ verb }) => {
    const { t } = useI18n();

    return (
        <div className="irregular-verb-card">
            <h4>{verb.verb}</h4>
            <p><strong>{t('Translation')}:</strong> {verb.translation}</p>
            <table>
                <thead>
                    <tr>
                        <th>{t('Tense')}</th>
                        <th>{t('Conjugation')}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(verb.conjugations).map(([tense, conjugation]) => (
                        <tr key={tense}>
                            <td>{tense}</td>
                            <td>{conjugation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IrregularVerbCard;
