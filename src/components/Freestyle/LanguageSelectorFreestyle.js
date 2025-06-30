import React from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Adjusted path if necessary
import './LanguageSelectorFreestyle.css';

const LanguageSelectorFreestyle = ({ selectedLanguage, onLanguageChange }) => {
    const { allTranslations } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        // Extract a more user-friendly name
        // Prioritize languageNameNative if available, then languageNameInEnglish, then fallback
        let name = allTranslations[langKey]?.languageNameNative || 
                   allTranslations[langKey]?.languageNameInEnglish || 
                   langKey.replace('COSY', ''); // Basic cleanup

        // If native and English names are different and both exist, show both
        if (allTranslations[langKey]?.languageNameNative && 
            allTranslations[langKey]?.languageNameInEnglish && 
            allTranslations[langKey]?.languageNameNative !== allTranslations[langKey]?.languageNameInEnglish) {
            name = `${allTranslations[langKey]?.languageNameNative} (${allTranslations[langKey]?.languageNameInEnglish})`;
        }
        
        return { key: langKey, name: name };
    });

    const handleChange = (event) => {
        if (onLanguageChange) {
            onLanguageChange(event.target.value);
        }
    };

    return (
        <div className="language-selector-freestyle-container"> {/* Added class for potential CSS targeting */}
            <label htmlFor="freestyle-language-select" className="language-selector-label">
                🌎:
            </label>
            <select 
                id="freestyle-language-select" 
                value={selectedLanguage} 
                onChange={handleChange} 
                className="language-selector-select"
                aria-label="Select language for freestyle mode"
            >
                {availableLanguages.map(lang => (
                    <option key={lang.key} value={lang.key}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelectorFreestyle;
