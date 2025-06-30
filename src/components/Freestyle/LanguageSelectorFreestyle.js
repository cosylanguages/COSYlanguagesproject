import React from 'react';
import { useI18n } from '../../i18n/I18nContext'; 
import '../LanguageSelector/LanguageSelector.css'; // Import unified CSS

const LanguageSelectorFreestyle = ({ selectedLanguage, onLanguageChange }) => {
    const { allTranslations } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        let name = allTranslations[langKey]?.languageNameNative || 
                   allTranslations[langKey]?.languageNameInEnglish || 
                   langKey.replace('COSY', '').replace('ТАКОЙ', '').replace('ΚΟΖΥ', '').replace('ԾՈՍՅ', ''); // General cleanup

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
        <div className="language-selector-container"> {/* Use unified class */}
            <label htmlFor="freestyle-language-select" className="language-select-label">
                🌎:
            </label>
            <select 
                id="freestyle-language-select" 
                value={selectedLanguage} 
                onChange={handleChange} 
                className="language-select-dropdown" /* Use unified class */
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
