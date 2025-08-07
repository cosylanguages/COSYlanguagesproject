import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useI18n();

    const handlePrevious = () => {
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination-controls">
            <button onClick={handlePrevious} disabled={currentPage === 1}>
                {t('pagination.previous', 'Previous')}
            </button>
            <span>
                {t('pagination.page', 'Page')} {currentPage} {t('pagination.of', 'of')} {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
                {t('pagination.next', 'Next')}
            </button>
        </div>
    );
};

export default Pagination;
