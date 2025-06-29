import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Reuse shared CSS

const ConfigureEssayBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [promptText, setPromptText] = useState(existingBlockData?.prompt || {}); // { COSYenglish: "Essay prompt...", ... }

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            setPromptText(ensureAllLangs(existingBlockData.prompt || {}, availableLanguages, ''));
        } else {
            setPromptText(ensureAllLangs({}, availableLanguages, ''));
        }
    }, [existingBlockData, availableLanguages]);

    const ensureAllLangs = (textObj, langs, defaultValue = '') => {
        const newTextObj = { ...textObj };
        langs.forEach(lang => {
            if (newTextObj[lang] === undefined || newTextObj[lang] === null) {
                newTextObj[lang] = defaultValue;
            }
        });
        return newTextObj;
    };

    const handleBlockTitleChange = (lang, value) => {
        setBlockTitle(prev => ({ ...prev, [lang]: value }));
    };

    const handlePromptChange = (lang, value) => {
        setPromptText(prev => ({ ...prev, [lang]: value }));
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Essay';
            }
        });

        const promptToSave = { ...promptText };
        if (!Object.values(promptToSave).some(text => text.trim() !== '')) {
            alert(t('alertEssayPromptRequired') || 'Please enter an essay prompt.');
            return;
        }
        availableLanguages.forEach(lang => {
            if (!promptToSave[lang]) {
                promptToSave[lang] = promptToSave[currentUILanguage]?.trim() || promptToSave.COSYenglish?.trim() || '';
            }
        });

        onSave({
            id: existingBlockData?.id || `ess_${Date.now()}`,
            type: 'writing/essay',
            title: titleToSave,
            prompt: promptToSave, 
        });
    };

    return (
        <div className="configure-essay-block configure-simple-block">
            <h4>{t('configureEssayBlockTitle') || 'Configure Essay Block'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-ess">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-ess"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., My Summer Vacation'}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor={`essay-prompt-${currentUILanguage}`}>
                    {t('essayPromptLabel', { langName: currentUILanguage.replace('COSY','') }) || `Essay Prompt/Question (${currentUILanguage.replace('COSY','')})`}:
                </label>
                <textarea
                    id={`essay-prompt-${currentUILanguage}`}
                    value={promptText[currentUILanguage] || ''}
                    onChange={(e) => handlePromptChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterEssayPromptPlaceholder') || 'Enter the essay prompt or question...'}
                    rows="5"
                />
            </div>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureEssayBlock;
