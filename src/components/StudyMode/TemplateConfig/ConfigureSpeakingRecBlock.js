import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Reusing for basic layout

const ConfigureSpeakingRecBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [promptText, setPromptText] = useState(existingBlockData?.prompt || {}); // Prompt for the student to respond to

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
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Voice Recording Task';
            }
        });

        const promptToSave = { ...promptText };
        if (!Object.values(promptToSave).some(text => text.trim() !== '')) {
            alert(t('alertSpeakingPromptRequired') || 'Please enter a prompt for the speaking task.');
            return;
        }
        availableLanguages.forEach(lang => {
            if (!promptToSave[lang]) {
                promptToSave[lang] = promptToSave[currentUILanguage]?.trim() || promptToSave.COSYenglish?.trim() || '';
            }
        });

        onSave({
            id: existingBlockData?.id || `speakrec_${Date.now()}`,
            type: 'speaking/user-recording',
            title: titleToSave,
            prompt: promptToSave, 
        });
    };

    return (
        <div className="configure-speaking-rec-block configure-simple-block">
            <h4>{t('configureSpeakingRecBlockTitle') || 'Configure Voice Recording Block'}</h4>
            <p><em>{t('speakingRecFeatureNotice') || 'Note: Full voice recording and playback requires browser permissions and may need backend support for storing recordings. This is a basic setup for the prompt.'}</em></p>

            <div className="form-group">
                <label htmlFor="block-title-speakrec">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-speakrec"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Answer the Question'}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor={`speaking-prompt-${currentUILanguage}`}>
                    {t('speakingPromptLabel', { langName: currentUILanguage.replace('COSY','') }) || `Prompt/Question for Speaking Task (${currentUILanguage.replace('COSY','')})`}:
                </label>
                <textarea
                    id={`speaking-prompt-${currentUILanguage}`}
                    value={promptText[currentUILanguage] || ''}
                    onChange={(e) => handlePromptChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterSpeakingPromptPlaceholder') || 'Enter the question or topic for the student to speak about...'}
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

export default ConfigureSpeakingRecBlock;
