import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../Common/TransliterableText';
import Modal from '../../Common/Modal'; // Using the common Modal component

// Basic styling can be added to a shared ConfigBlocks.css or TeacherDashboard.css

const TextBlockConfig = ({ block, onSave, onClose }) => {
  const { t, currentLangKey } = useI18n(); // Get current global language

  // Initialize state from block.data or with defaults
  const [title, setTitle] = useState(block.data.title || { default: '' });
  const [content, setContent] = useState(block.data.content || { default: '' });
  const [blockLang, setBlockLang] = useState(block.data.lang || '');

  useEffect(() => {
    // Update state if the block prop changes (e.g., selecting a different block to edit)
    setTitle(block.data.title || { default: '' });
    setContent(block.data.content || { default: '' });
    setBlockLang(block.data.lang || '');
  }, [block]);

  const handleSave = () => {
    const updatedBlockData = {
      ...block.data,
      title,
      content,
      lang: blockLang.trim() === '' ? null : blockLang.trim(), // Store null if empty
    };
    onSave({ ...block, data: updatedBlockData });
    onClose(); // Close modal after saving
  };

  // Handle changes for multilingual fields (title, content)
  const handleMultilingualChange = (fieldSetter, currentFieldState, lang, value) => {
    fieldSetter({
      ...currentFieldState,
      [lang]: value,
    });
  };

  const currentGlobalLang = currentLangKey || 'default'; // Fallback to 'default'

  // DEV_NOTE: Multilingual input is simplified to 'default' and current global language.
  // A more advanced implementation might allow selecting/editing multiple specific languages.
  return (
    <Modal
        isOpen={true} // Controlled by TeacherDashboard's editingBlock state
        onClose={onClose}
        title={t('configureBlockTitle', { blockName: block.typeName }) || `Configure ${block.typeName}`}
    >
        <div className="text-block-config-form block-config-form"> {/* Added block-config-form */}
            {/* Title Inputs */}
            <div className="form-group">
                <label htmlFor={`title-default-${block.id}`} className="unified-label">
                    <TransliterableText text={t('config.titleDefaultLabel', 'Title (Default)')} />:
                </label>
                <input
                    type="text"
                    id={`title-default-${block.id}`}
                    value={title.default || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, title, 'default', e.target.value)}
                    placeholder={t('config.titleDefaultPlaceholder', 'Enter default title')}
                />
            </div>
            {currentGlobalLang !== 'default' && (
                 <div className="form-group">
                    <label htmlFor={`title-${currentGlobalLang}-${block.id}`} className="unified-label">
                        <TransliterableText text={t('config.titleLangLabel', { lang: currentGlobalLang } , `Title (${currentGlobalLang})`)} />:
                    </label>
                    <input
                        type="text"
                        id={`title-${currentGlobalLang}-${block.id}`}
                        value={title[currentGlobalLang] || ''}
                        onChange={(e) => handleMultilingualChange(setTitle, title, currentGlobalLang, e.target.value)}
                        placeholder={t('config.titleLangPlaceholder', { lang: currentGlobalLang }, `Enter title for ${currentGlobalLang}`)}
                    />
                </div>
            )}

            {/* Content Inputs */}
            <div className="form-group">
                <label htmlFor={`content-default-${block.id}`} className="unified-label">
                    <TransliterableText text={t('config.contentDefaultLabel', 'Content (Default)')} />:
                </label>
                <textarea
                    id={`content-default-${block.id}`}
                    value={content.default || ''}
                    onChange={(e) => handleMultilingualChange(setContent, content, 'default', e.target.value)}
                    rows="5"
                    placeholder={t('config.contentDefaultPlaceholder', 'Enter default content (markdown supported for line breaks)')}
                />
            </div>
            {currentGlobalLang !== 'default' && (
                <div className="form-group">
                    <label htmlFor={`content-${currentGlobalLang}-${block.id}`} className="unified-label">
                        <TransliterableText text={t('config.contentLangLabel', { lang: currentGlobalLang }, `Content (${currentGlobalLang})`)} />:
                    </label>
                    <textarea
                        id={`content-${currentGlobalLang}-${block.id}`}
                        value={content[currentGlobalLang] || ''}
                        onChange={(e) => handleMultilingualChange(setContent, content, currentGlobalLang, e.target.value)}
                        rows="5"
                        placeholder={t('config.contentLangPlaceholder', { lang: currentGlobalLang }, `Enter content for ${currentGlobalLang}`)}
                    />
                </div>
            )}

            {/* Block Language Override */}
            <div className="form-group">
                <label htmlFor={`block-lang-${block.id}`} className="unified-label">
                    <TransliterableText text={t('config.blockLangLabel', 'Language Override (e.g., COSYenglish)')} />:
                </label>
                <input
                    type="text"
                    id={`block-lang-${block.id}`}
                    value={blockLang}
                    onChange={(e) => setBlockLang(e.target.value)}
                    placeholder={t('config.blockLangPlaceholder', 'Leave empty to use global language')}
                />
                <p className="input-hint"><TransliterableText text={t('config.blockLangHint', 'If set, this language code (e.g., COSYfrench, COSYgerman) will be used for this block, overriding the global language selection for its content.')} /></p>
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

export default TextBlockConfig;
