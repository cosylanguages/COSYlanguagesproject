import React from 'react';
import Modal from '../Common/Modal'; // Adjust path if needed
import { useI18n } from '../../i18n/I18nContext';
import { availableTemplateSectionTypes, getEmojiForTemplateType } from '../../config/templateSections';
import './TemplateTypeSelectionModal.css'; // For specific styling

const TemplateTypeSelectionModal = ({ isOpen, onClose, onSelectTemplateType }) => {
    const { t } = useI18n();

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('selectTemplateTypeTitle') || 'Select Content Block Type'}
        >
            <div className="template-type-list">
                {Object.entries(availableTemplateSectionTypes).map(([categoryName, types]) => (
                    <div key={categoryName} className="template-category-group">
                        <h4 className="template-category-header" data-transliterable="true">
                            {t(categoryName.toLowerCase().replace(/\s+/g, '_')) || categoryName}
                        </h4>
                        <ul className="template-options-list">
                            {Object.entries(types).map(([typeName, typePath]) => (
                                <li key={typePath} className="template-option-item">
                                    <button 
                                        onClick={() => onSelectTemplateType(typePath, typeName)}
                                        className="template-type-option-btn"
                                        aria-label={t(typeName.toLowerCase().replace(/\s+/g, '_')) || typeName}
                                    >
                                        <span className="emoji-icon">{getEmojiForTemplateType(typePath)}</span>
                                        <span className="template-option-name" data-transliterable="true">
                                            {t(typeName.toLowerCase().replace(/\s+/g, '_')) || typeName}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary">
                    {t('closeBtn') || 'Close'}
                </button>
            </div>
        </Modal>
    );
};

export default TemplateTypeSelectionModal;
