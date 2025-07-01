import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../Common/TransliterableText';
import Modal from '../../Common/Modal';
import './ConfigBlocks.css'; // Re-use common styles

const MCQMultipleBlockConfig = ({ block, onSave, onClose }) => {
  const { t, currentLangKey } = useI18n();
  const currentGlobalLang = currentLangKey || 'default';

  const [title, setTitle] = useState(block.data.title || { default: '' });
  const [question, setQuestion] = useState(block.data.question || { default: '' });
  const [options, setOptions] = useState(block.data.options || []);
  const [blockLang, setBlockLang] = useState(block.data.lang || '');

  useEffect(() => {
    setTitle(block.data.title || { default: '' });
    setQuestion(block.data.question || { default: '' });
    // Ensure options have a feedback field, defaulting to an empty object if not present
    setOptions((block.data.options || []).map(opt => ({ ...opt, feedback: opt.feedback || { default: '' } })));
    setBlockLang(block.data.lang || '');
  }, [block]);

  const handleSave = () => {
    const updatedBlockData = {
      ...block.data,
      title,
      question,
      options: options.map(opt => ({
        ...opt,
        // Ensure feedback is null if all its language fields are empty, or not present if object is empty
        feedback: (opt.feedback && Object.values(opt.feedback).some(val => val && val.trim() !== '')) ? opt.feedback : null,
      })),
      lang: blockLang.trim() === '' ? null : blockLang.trim(),
    };
    onSave({ ...block, data: updatedBlockData });
    onClose();
  };

  const handleMultilingualChange = (fieldSetter, currentFieldState, lang, value) => {
    fieldSetter({ ...currentFieldState, [lang]: value });
  };

  const handleOptionPropertyChange = (index, propertyName, value, lang = null) => {
    const newOptions = [...options];
    if (lang) { // For multilingual properties like 'texts' or 'feedback'
      newOptions[index][propertyName] = { 
        ...(newOptions[index][propertyName] || {}), 
        [lang]: value 
      };
    } else { // For direct properties like 'isCorrect'
      newOptions[index][propertyName] = value;
    }
    setOptions(newOptions);
  };


  const addOption = () => {
    setOptions([...options, { 
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      texts: { default: '' }, 
      isCorrect: false,
      feedback: { default: '' } // Initialize feedback field
    }]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // DEV_NOTE: Multilingual input is simplified to 'default' and current global language.
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={t('configureBlockTitle', { blockName: block.typeName }) || `Configure ${block.typeName}`}
    >
      <div className="mcq-multiple-config-form block-config-form">
        {/* Title */}
        <div className="form-group">
          <label><TransliterableText text={t('config.titleDefaultLabel', 'Title (Default)')} />:</label>
          <input
            type="text"
            value={title.default || ''}
            onChange={(e) => handleMultilingualChange(setTitle, title, 'default', e.target.value)}
          />
        </div>
        {currentGlobalLang !== 'default' && (
          <div className="form-group">
            <label><TransliterableText text={t('config.titleLangLabel', { lang: currentGlobalLang }, `Title (${currentGlobalLang})`)} />:</label>
            <input
              type="text"
              value={title[currentGlobalLang] || ''}
              onChange={(e) => handleMultilingualChange(setTitle, title, currentGlobalLang, e.target.value)}
            />
          </div>
        )}

        {/* Question */}
        <div className="form-group">
          <label><TransliterableText text={t('config.questionDefaultLabel', 'Question (Default)')} />:</label>
          <textarea
            value={question.default || ''}
            onChange={(e) => handleMultilingualChange(setQuestion, question, 'default', e.target.value)}
            rows="3"
          />
        </div>
        {currentGlobalLang !== 'default' && (
          <div className="form-group">
            <label><TransliterableText text={t('config.questionLangLabel', { lang: currentGlobalLang }, `Question (${currentGlobalLang})`)} />:</label>
            <textarea
              value={question[currentGlobalLang] || ''}
              onChange={(e) => handleMultilingualChange(setQuestion, question, currentGlobalLang, e.target.value)}
              rows="3"
            />
          </div>
        )}

        {/* Options */}
        <fieldset className="form-group options-fieldset">
          <legend><TransliterableText text={t('config.mcqOptionsLabel', 'Options')} /></legend>
          {options.map((option, index) => (
            <div key={option.id || index} className="mcq-option-config-item">
              <div className="option-inputs">
                {/* Option Text */}
                <div className="form-group option-text-group">
                  <label htmlFor={`option-text-default-${index}`}><TransliterableText text={t('config.optionTextDefaultLabel', 'Option Text (Default)')} />:</label>
                  <input
                    type="text"
                    id={`option-text-default-${index}`}
                    value={option.texts?.default || ''}
                    onChange={(e) => handleOptionPropertyChange(index, 'texts', e.target.value, 'default')}
                  />
                </div>
                {currentGlobalLang !== 'default' && (
                  <div className="form-group option-text-group">
                    <label htmlFor={`option-text-${currentGlobalLang}-${index}`}><TransliterableText text={t('config.optionTextLangLabel', { lang: currentGlobalLang }, `Option Text (${currentGlobalLang})`)} />:</label>
                    <input
                      type="text"
                      id={`option-text-${currentGlobalLang}-${index}`}
                      value={option.texts?.[currentGlobalLang] || ''}
                      onChange={(e) => handleOptionPropertyChange(index, 'texts', e.target.value, currentGlobalLang)}
                    />
                  </div>
                )}

                {/* Option Feedback */}
                <div className="form-group option-feedback-group">
                  <label htmlFor={`option-feedback-default-${index}`}><TransliterableText text={t('config.optionFeedbackDefaultLabel', 'Feedback (Default)')} />:</label>
                  <textarea
                    id={`option-feedback-default-${index}`}
                    value={option.feedback?.default || ''}
                    onChange={(e) => handleOptionPropertyChange(index, 'feedback', e.target.value, 'default')}
                    rows="2"
                    placeholder={t('config.optionFeedbackPlaceholder', 'Optional feedback for this option')}
                  />
                </div>
                {currentGlobalLang !== 'default' && (
                  <div className="form-group option-feedback-group">
                    <label htmlFor={`option-feedback-${currentGlobalLang}-${index}`}><TransliterableText text={t('config.optionFeedbackLangLabel', { lang: currentGlobalLang }, `Feedback (${currentGlobalLang})`)} />:</label>
                    <textarea
                      id={`option-feedback-${currentGlobalLang}-${index}`}
                      value={option.feedback?.[currentGlobalLang] || ''}
                      onChange={(e) => handleOptionPropertyChange(index, 'feedback', e.target.value, currentGlobalLang)}
                      rows="2"
                      placeholder={t('config.optionFeedbackPlaceholder', 'Optional feedback for this option')}
                    />
                  </div>
                )}

                {/* Is Correct Checkbox */}
                <div className="form-group option-correct-group">
                  <label htmlFor={`option-correct-${index}`} className="checkbox-label">
                    <input
                      type="checkbox"
                      id={`option-correct-${index}`}
                      checked={!!option.isCorrect} // Ensure it's a boolean
                      onChange={(e) => handleOptionPropertyChange(index, 'isCorrect', e.target.checked)}
                    />
                    <TransliterableText text={t('config.isCorrectLabel', 'Correct Answer')} />
                  </label>
                </div>
              </div>
              <button type="button" onClick={() => removeOption(index)} className="btn btn-sm btn-danger remove-option-btn">
                <TransliterableText text={t('removeOptionBtn', 'Remove Option')} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} className="btn btn-sm btn-secondary add-option-btn">
            <TransliterableText text={t('addOptionBtn', '+ Add Option')} />
          </button>
        </fieldset>

        {/* Block Language Override */}
        <div className="form-group">
          <label><TransliterableText text={t('config.blockLangLabel', 'Language Override (e.g., COSYenglish)')} />:</label>
          <input
            type="text"
            value={blockLang}
            onChange={(e) => setBlockLang(e.target.value)}
            placeholder={t('config.blockLangPlaceholder', 'Leave empty to use global language')}
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} className="btn btn-primary">
            <TransliterableText text={t('saveConfigBtn', 'Save Configuration')} />
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            <TransliterableText text={t('cancelBtn', 'Cancel')} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MCQMultipleBlockConfig;
