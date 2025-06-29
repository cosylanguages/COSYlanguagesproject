import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextDisplay.css'; // Reuse shared CSS for basic structure

const ArticleBlock = ({ blockData }) => {
    const { t, language } = useI18n();
    const { title, content = {} } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('articleBlockDefaultTitle') || 'Article';
    const articleHtml = content?.[language] || content?.COSYenglish || content?.default || '';

    // Basic sanitization placeholder - for production, use a robust library like DOMPurify
    const sanitizeHtml = (htmlString) => {
        // This is NOT a complete sanitizer. Replace with a proper library.
        // For now, it just prevents <script> tags.
        const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        return htmlString.replace(scriptPattern, '');
    };
    
    const sanitizedHtml = sanitizeHtml(articleHtml);


    return (
        <div className="article-block display-simple-block">
            <h4>{blockTitle}</h4>
            {sanitizedHtml ? (
                <div 
                    className="article-content-display" 
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
                />
            ) : (
                <p>({t('noArticleContentProvided') || 'No article content provided.'})</p>
            )}
        </div>
    );
};

export default ArticleBlock;
