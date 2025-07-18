import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../Common/TransliterableText';
import './WritingBlock.css';

const WritingBlock = ({ blockData, onAnswer }) => {
    const { t } = useI18n();
    const { title, prompt } = blockData;
    const [response, setResponse] = useState('');

    const handleSubmit = () => {
        if (onAnswer) {
            onAnswer({
                blockId: blockData.id,
                response,
            });
        }
    };

    return (
        <div className="writing-block display-simple-block">
            <h4><TransliterableText text={title} /></h4>
            <p className="writing-prompt"><TransliterableText text={prompt} /></p>
            <textarea
                className="writing-response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={t('writingBlock.placeholder', 'Write your response here...')}
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
                <TransliterableText text={t('writingBlock.submitButton', 'Submit')} />
            </button>
        </div>
    );
};

export default WritingBlock;
