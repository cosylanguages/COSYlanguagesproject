import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './TemplateEditor.css';

const TemplateEditor = ({ onSave, onClose }) => {
    const { t } = useI18n();

    return (
        <div className="template-editor-modal">
            <div className="template-editor-content">
                <h2><TransliterableText text={t('templateEditor.title', 'Template Editor')} /></h2>
                <div className="template-editor-body">
                    <p><TransliterableText text={t('templateEditor.instructions', 'Add, remove, and configure blocks to create your template.')} /></p>
                </div>
                <div className="template-editor-actions">
                    <button className="btn btn-primary" onClick={onSave}>
                        <TransliterableText text={t('templateEditor.saveButton', 'Save Template')} />
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        <TransliterableText text={t('templateEditor.closeButton', 'Close')} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateEditor;
