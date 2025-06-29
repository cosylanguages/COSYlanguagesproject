import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Import shared CSS

const ConfigureTextBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [textContent, setTextContent] = useState(existingBlockData?.content || {}); // { COSYenglish: "Text...", ... }

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            setTextContent(ensureAllLangs(existingBlockData.content || {}, availableLanguages, ''));
        } else {
            // For new blocks, ensure initial content has multilingual structure
            setTextContent(ensureAllLangs({}, availableLanguages, ''));
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

    const handleTextContentChange = (lang, value) => {
        setTextContent(prev => ({ ...prev, [lang]: value }));
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Text Block';
            }
        });

        const contentToSave = { ...textContent };
        if (!Object.values(contentToSave).some(text => text.trim() !== '')) {
            alert(t('alertTextContentRequired') || 'Please enter some text content.');
            return;
        }
        availableLanguages.forEach(lang => {
            if (!contentToSave[lang]) { // Ensure all language fields exist, even if empty
                contentToSave[lang] = contentToSave[currentUILanguage]?.trim() || contentToSave.COSYenglish?.trim() || '';
            }
        });


        onSave({
            id: existingBlockData?.id || `txt_${Date.now()}`,
            type: 'reading/text',
            title: titleToSave,
            content: contentToSave, 
        });
    };

    return (
        <div className="configure-text-block configure-simple-block"> {/* Added configure-simple-block for common styles */}
            <h4>{t('configureTextBlockTitle') || 'Configure Text Block'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-txt">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-txt"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Instructions'}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor={`text-content-${currentUILanguage}`}>
                    {t('textContentLabel', { langName: currentUILanguage.replace('COSY','') }) || `Text Content (${currentUILanguage.replace('COSY','')})`}:
                </label>
                <textarea
                    id={`text-content-${currentUILanguage}`}
                    value={textContent[currentUILanguage] || ''}
                    onChange={(e) => handleTextContentChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterTextContentPlaceholder') || 'Enter your text here...'}
                    rows="8"
                />
            </div>
            {/* Consider adding a way to edit other languages if needed, or assume currentUILanguage is primary edit */}

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureTextBlock;
