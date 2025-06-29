import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Reuse shared CSS

const ConfigureArticleBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [articleContent, setArticleContent] = useState(existingBlockData?.content || {}); // { COSYenglish: "HTML content...", ... }

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            setArticleContent(ensureAllLangs(existingBlockData.content || {}, availableLanguages, ''));
        } else {
            setArticleContent(ensureAllLangs({}, availableLanguages, ''));
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

    const handleArticleContentChange = (lang, value) => {
        setArticleContent(prev => ({ ...prev, [lang]: value }));
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Article';
            }
        });

        const contentToSave = { ...articleContent };
        if (!Object.values(contentToSave).some(text => text.trim() !== '')) {
            alert(t('alertArticleContentRequired') || 'Please enter some article content.');
            return;
        }
         availableLanguages.forEach(lang => {
            if (!contentToSave[lang]) { 
                contentToSave[lang] = contentToSave[currentUILanguage]?.trim() || contentToSave.COSYenglish?.trim() || '';
            }
        });

        onSave({
            id: existingBlockData?.id || `art_${Date.now()}`,
            type: 'reading/article',
            title: titleToSave,
            content: contentToSave, 
        });
    };

    return (
        <div className="configure-article-block configure-simple-block">
            <h4>{t('configureArticleBlockTitle') || 'Configure Article Block'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-art">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-art"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Interesting Article'}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor={`article-content-${currentUILanguage}`}>
                    {t('articleContentLabel', { langName: currentUILanguage.replace('COSY','') }) || `Article Content (HTML/Markdown) (${currentUILanguage.replace('COSY','')})`}:
                </label>
                <textarea
                    id={`article-content-${currentUILanguage}`}
                    value={articleContent[currentUILanguage] || ''}
                    onChange={(e) => handleArticleContentChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterArticleContentPlaceholder') || 'Enter your article text here. You can use simple HTML for formatting.'}
                    rows="12"
                />
            </div>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureArticleBlock;
