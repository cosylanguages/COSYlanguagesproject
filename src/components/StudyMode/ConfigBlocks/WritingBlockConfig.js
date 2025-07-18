import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../Common/TransliterableText';

const WritingBlockConfig = ({ block, onSave, onClose }) => {
    const { t } = useI18n();
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (block && block.data && block.data.prompt) {
            setPrompt(block.data.prompt.default || '');
        }
    }, [block]);

    const handleSave = () => {
        const updatedBlock = {
            ...block,
            data: {
                ...block.data,
                prompt: {
                    ...block.data.prompt,
                    default: prompt,
                },
            },
        };
        onSave(updatedBlock);
    };

    return (
        <div className="block-configuration-modal">
            <div className="modal-content">
                <h3><TransliterableText text={t('writingBlockConfig.title', 'Configure Writing Block')} /></h3>
                <div className="form-group">
                    <label htmlFor="writing-prompt-input">
                        <TransliterableText text={t('writingBlockConfig.promptLabel', 'Prompt')} />
                    </label>
                    <input
                        id="writing-prompt-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave} className="btn btn-primary">
                        <TransliterableText text={t('writingBlockConfig.saveButton', 'Save')} />
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                        <TransliterableText text={t('writingBlockConfig.closeButton', 'Close')} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritingBlockConfig;
