import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './TemplateList.css';

const TemplateList = ({ openTemplateEditor }) => {
    const { t } = useI18n();

    return (
        <div className="template-list-container">
            <h2><TransliterableText text={t('templateList.title', 'Lesson Templates')} /></h2>
            <div className="template-list-actions">
                <button className="btn btn-primary" onClick={openTemplateEditor}>
                    <TransliterableText text={t('templateList.createButton', 'Create New Template')} />
                </button>
            </div>
            <div className="template-list">
                <p><TransliterableText text={t('templateList.noTemplates', 'No templates created yet.')} /></p>
            </div>
        </div>
    );
};

export default TemplateList;
