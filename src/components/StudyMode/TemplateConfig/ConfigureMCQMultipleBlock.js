import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextConfig.css'; // Reusing for basic layout
import './ConfigureMCQMultipleBlock.css'; // Specific styles

const ConfigureMCQMultipleBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    const [question, setQuestion] = useState(existingBlockData?.question || {});
    // Options structure: [{ id: 'opt1', texts: {COSYenglish: 'Option 1'}, isCorrect: false }, ...]
    const [options, setOptions] = useState(existingBlockData?.options || [{ id: `opt_${Date.now()}_0`, texts: {}, isCorrect: false }]);

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            setQuestion(ensureAllLangs(existingBlockData.question || {}, availableLanguages, ''));
            const loadedOptions = existingBlockData.options || [{ id: `opt_${Date.now()}_0`, texts: {}, isCorrect: false }];
            setOptions(loadedOptions.map(opt => ({
                ...opt,
                texts: ensureAllLangs(opt.texts || {}, availableLanguages, '')
            })));
        } else {
            setQuestion(ensureAllLangs({}, availableLanguages, ''));
            setOptions([{ id: `opt_${Date.now()}_0`, texts: ensureAllLangs({}, availableLanguages, ''), isCorrect: false }]);
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

    const handleQuestionChange = (lang, value) => {
        setQuestion(prev => ({ ...prev, [lang]: value }));
    };

    const handleOptionTextChange = (index, lang, value) => {
        const newOptions = [...options];
        if (!newOptions[index].texts) newOptions[index].texts = {};
        newOptions[index].texts[lang] = value;
        setOptions(newOptions);
    };

    const handleOptionCorrectChange = (index) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = !newOptions[index].isCorrect;
        setOptions(newOptions);
    };

    const addOption = () => {
        // Limit number of options if desired, e.g., max 6
        // if (options.length >= 6) {
        //     alert(t('maxOptionsReached') || "Maximum of 6 options allowed.");
        //     return;
        // }
        const newOption = { id: `opt_${Date.now()}_${options.length}`, texts: {}, isCorrect: false };
        availableLanguages.forEach(lang => {
            newOption.texts[lang] = '';
        });
        setOptions([...options, newOption]);
    };

    const removeOption = (index) => {
        if (options.length > 2) { // Typically need at least 2 options for MCQ
            setOptions(options.filter((_, i) => i !== index));
        } else {
            alert(t('minTwoOptionsMCQ') || 'At least two options are required for a multiple-choice question.');
        }
    };

    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Multiple Choice Question';
            }
        });
        
        const questionToSave = { ...question };
        if (!Object.values(questionToSave).some(q => q.trim() !== '')) {
            alert(t('alertMCQQuestionRequired') || 'Please enter the question text.');
            return;
        }
         availableLanguages.forEach(lang => {
            if (!questionToSave[lang]) {
                questionToSave[lang] = questionToSave[currentUILanguage]?.trim() || questionToSave.COSYenglish?.trim() || '';
            }
        });

        const validOptions = options.filter(opt => Object.values(opt.texts).some(text => text.trim() !== ''));
        if (validOptions.length < 2) {
            alert(t('alertMinTwoOptionsPopulatedMCQ') || 'Please provide text for at least two options.');
            return;
        }
        if (!validOptions.some(opt => opt.isCorrect)) {
            alert(t('alertMinOneCorrectOptionMCQ') || 'Please mark at least one option as correct.');
            return;
        }
        
        const processedOptions = validOptions.map(opt => {
            const newTexts = { ...opt.texts };
            availableLanguages.forEach(lang => {
                if (!newTexts[lang] || newTexts[lang].trim() === '') {
                     newTexts[lang] = newTexts[currentUILanguage]?.trim() || newTexts.COSYenglish?.trim() || `Option ${opt.id}`;
                }
            });
            return { ...opt, texts: newTexts };
        });


        onSave({
            id: existingBlockData?.id || `mcqm_${Date.now()}`,
            type: 'comprehension/mcq-multiple',
            title: titleToSave,
            question: questionToSave,
            options: processedOptions,
        });
    };

    return (
        <div className="configure-mcq-multiple-block configure-simple-block">
            <h4>{t('configureMCQMultipleTitle') || 'Configure Multiple Choice (Multiple Answers)'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-mcqm">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-mcqm"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor={`mcqm-question-${currentUILanguage}`}>{t('questionLabel', { langName: currentUILanguage.replace('COSY','') }) || `Question (${currentUILanguage.replace('COSY','')})`}:</label>
                <textarea
                    id={`mcqm-question-${currentUILanguage}`}
                    value={question[currentUILanguage] || ''}
                    onChange={(e) => handleQuestionChange(currentUILanguage, e.target.value)}
                    rows="3"
                />
            </div>

            <h5>{t('optionsLabel') || 'Options'}:</h5>
            {options.map((option, index) => (
                <div key={option.id || index} className="mcq-option-config-entry">
                    <div className="form-group option-text-group">
                        <label htmlFor={`mcqm-option-${index}-${currentUILanguage}`}>
                            {t('optionTextLabel', { number: index + 1, langName: currentUILanguage.replace('COSY','') }) || `Option ${index + 1} Text (${currentUILanguage.replace('COSY','')})`}:
                        </label>
                        <input
                            type="text"
                            id={`mcqm-option-${index}-${currentUILanguage}`}
                            value={option.texts?.[currentUILanguage] || ''}
                            onChange={(e) => handleOptionTextChange(index, currentUILanguage, e.target.value)}
                        />
                    </div>
                    <div className="form-group option-correct-group">
                        <label htmlFor={`mcqm-correct-${index}`}>
                            <input
                                type="checkbox"
                                id={`mcqm-correct-${index}`}
                                checked={option.isCorrect}
                                onChange={() => handleOptionCorrectChange(index)}
                            />
                            {t('correctAnswerCheckbox') || 'Correct Answer'}
                        </label>
                    </div>
                    {options.length > 2 && (
                        <button onClick={() => removeOption(index)} className="btn btn-danger btn-sm remove-option-btn">
                            {t('removeOptionBtn') || 'Remove Option'}
                        </button>
                    )}
                </div>
            ))}
            <button onClick={addOption} className="btn btn-secondary add-option-btn">
                {t('addOptionBtn') || '+ Add Option'}
            </button>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureMCQMultipleBlock;
