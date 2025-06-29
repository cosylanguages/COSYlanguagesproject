import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './WordlistBlock.css'; 

const WordlistBlock = ({ blockData }) => {
    const { t, language } = useI18n();
    const { title, items = [] } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('wordlistDefaultTitle') || 'Wordlist';

    // State to manage visibility of term2 for each item: { item_id: boolean }
    const [term2Visibility, setTerm2Visibility] = useState({});

    const toggleTerm2Visibility = (itemId) => {
        setTerm2Visibility(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };
    
    const allTerm2Visible = items.every(item => term2Visibility[item.id]);

    const toggleAllTerm2Visibility = () => {
        if (allTerm2Visible) {
            // If all are visible, hide all
            const newVisibility = {};
            items.forEach(item => { newVisibility[item.id] = false; });
            setTerm2Visibility(newVisibility);
        } else {
            // If any (or all) are hidden, show all
            const newVisibility = {};
            items.forEach(item => { newVisibility[item.id] = true; });
            setTerm2Visibility(newVisibility);
        }
    };


    if (!items || items.length === 0) {
        return (
            <div className="wordlist-block">
                <h4>{blockTitle}</h4>
                <p>{t('noItemsInWordlist') || 'This wordlist is currently empty.'}</p>
            </div>
        );
    }

    return (
        <div className="wordlist-block">
            <h4>{blockTitle}</h4>
            {items.some(item => item.term2Texts?.[language]?.trim() || item.term2Texts?.COSYenglish?.trim()) && (
                 <button onClick={toggleAllTerm2Visibility} className="btn btn-sm btn-outline-secondary toggle-all-terms-btn">
                    {allTerm2Visible ? (t('hideAllTranslationsBtn') || 'Hide All Translations') : (t('showAllTranslationsBtn') || 'Show All Translations')}
                </button>
            )}
            <ul className="wordlist-display-list">
                {items.map((item) => {
                    const term1 = item.term1Texts?.[language] || item.term1Texts?.COSYenglish || `Item ${item.id}`;
                    const term2 = item.term2Texts?.[language] || item.term2Texts?.COSYenglish || '';
                    const hasTerm2 = term2.trim() !== '';

                    return (
                        <li key={item.id} className="wordlist-display-item">
                            <span className="term1">
                                {term1}
                                {term1 && (
                                    <button 
                                        onClick={() => pronounceText(term1, language)} 
                                        className="btn-icon pronounce-btn" 
                                        title={t('pronounceTerm', { term: term1 }) || `Pronounce "${term1}"`}
                                        aria-label={t('pronounceTerm', { term: term1 }) || `Pronounce "${term1}"`}
                                    >
                                        🔊
                                    </button>
                                )}
                            </span>
                            {hasTerm2 && (
                                <div className="term2-container">
                                    <span className={`term2 ${term2Visibility[item.id] ? 'visible' : 'hidden'}`}>
                                        {term2Visibility[item.id] ? term2 : '••••••••'}
                                    </span>
                                    {term2Visibility[item.id] && term2 && (
                                        <button 
                                            onClick={() => pronounceText(term2, language)} 
                                            className="btn-icon pronounce-btn"
                                            title={t('pronounceTerm', { term: term2 }) || `Pronounce "${term2}"`}
                                            aria-label={t('pronounceTerm', { term: term2 }) || `Pronounce "${term2}"`}
                                        >
                                            🔊
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => toggleTerm2Visibility(item.id)} 
                                        className="btn btn-sm btn-light toggle-term2-btn"
                                        aria-label={term2Visibility[item.id] ? t('hideTranslationForItem', { term: term1 }) : t('showTranslationForItem', { term: term1 })}
                                    >
                                        {term2Visibility[item.id] ? '👁️‍🗨️' : '👁️'}
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default WordlistBlock;
