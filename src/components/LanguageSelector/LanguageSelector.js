import React from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Adjust path as needed
import './LanguageSelector.css'; // For styling

const LanguageSelector = () => {
    const { language, changeLanguage, allTranslations } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        // Extract a more user-friendly name if possible, otherwise use the key
        let name = allTranslations[langKey]?.languageNameInEnglish || 
                   langKey.replace('COSY', '').replace('ТАКОЙ', ''); // Basic cleanup
        if (langKey === 'ΚΟΖΥελληνικά') name = 'Greek'; // Specific override if needed
        else if (langKey === 'ТАКОЙрусский') name = 'Russian';
        else if (langKey === 'ԾՈՍՅհայկական') name = 'Armenian';
        
        // Attempt to get native name if available in translations
        const nativeName = allTranslations[langKey]?.languageNameNative;
        if (nativeName) {
            name = `${nativeName} (${name})`;
        }

        return { key: langKey, name: name };
    });

    const handleChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (
        <div className="language-selector-container">
            <label htmlFor="language-select" className="language-select-label">
                🌎: {/* Simple emoji label, could be translated too */}
            </label>
            <select id="language-select" value={language} onChange={handleChange} className="language-select-dropdown">
                {availableLanguages.map(lang => (
                    <option key={lang.key} value={lang.key}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
