import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Reusing for basic layout

const ConfigureAssessmentTestBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    // For a real test, 'config' would be a complex object defining questions, types, answers, etc.
    const [testConfig, setTestConfig] = useState(existingBlockData?.config || { description: '' }); 

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            // Ensure 'config' and its 'description' field are multilingual
            const loadedConfig = existingBlockData.config || { description: '' };
            const newConfig = {
                ...loadedConfig,
                description: ensureAllLangs(loadedConfig.description || {}, availableLanguages, '')
            };
            setTestConfig(newConfig);
        } else {
             setTestConfig({ description: ensureAllLangs({}, availableLanguages, '') });
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

    const handleDescriptionChange = (lang, value) => {
        setTestConfig(prev => ({ 
            ...prev, 
            description: {
                ...prev.description,
                [lang]: value
            }
        }));
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Assessment Test';
            }
        });

        const configToSave = { ...testConfig };
        if (!Object.values(configToSave.description).some(desc => desc.trim() !== '')) {
            alert(t('alertTestDescriptionRequired') || 'Please enter a description for the test.');
            return;
        }
        availableLanguages.forEach(lang => {
            if (!configToSave.description[lang]) {
                configToSave.description[lang] = configToSave.description[currentUILanguage]?.trim() || configToSave.description.COSYenglish?.trim() || '';
            }
        });


        onSave({
            id: existingBlockData?.id || `test_${Date.now()}`,
            type: 'assessment/test',
            title: titleToSave,
            config: configToSave, // This would be much more complex in reality
        });
    };

    return (
        <div className="configure-assessment-test-block configure-simple-block">
            <h4>{t('configureAssessmentTestTitle') || 'Configure Assessment Test Block'}</h4>
            <p><em>{t('assessmentTestFeatureNotice') || 'Note: This is a placeholder for a full test configuration UI. Currently, only a title and description can be set.'}</em></p>

            <div className="form-group">
                <label htmlFor="block-title-test">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-test"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterTestTitlePlaceholder') || 'E.g., Mid-term Exam'}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor={`test-description-${currentUILanguage}`}>
                    {t('testDescriptionLabel', { langName: currentUILanguage.replace('COSY','') }) || `Test Description/Instructions (${currentUILanguage.replace('COSY','')})`}:
                </label>
                <textarea
                    id={`test-description-${currentUILanguage}`}
                    value={testConfig.description?.[currentUILanguage] || ''}
                    onChange={(e) => handleDescriptionChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterTestDescriptionPlaceholder') || 'Describe the test or provide instructions...'}
                    rows="5"
                />
            </div>

            {/* Future: Add UI for question creation, setting answers, points, etc. */}

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureAssessmentTestBlock;
