import React, { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext'; 
import '../LanguageSelector/LanguageSelector.css'; // Import unified CSS

const LanguageSelectorFreestyle = () => { // selectedLanguage prop is no longer needed, gets from context
    const { allTranslations, changeLanguage, currentLangKey, t } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        // Skip "null" if it somehow ends up in allTranslations keys, though it shouldn't
        if (langKey === "null" || !allTranslations[langKey]) return null;

        let name = allTranslations[langKey]?.languageNameNative || 
                   allTranslations[langKey]?.languageNameInEnglish || 
                   langKey.replace(/^(COSY|ТАКОЙ|ΚΟΖΥ|ԾՈՍՅ)/, '');

        if (allTranslations[langKey]?.languageNameNative && 
            allTranslations[langKey]?.languageNameInEnglish && 
            allTranslations[langKey]?.languageNameNative !== allTranslations[langKey]?.languageNameInEnglish) {
            name = `${allTranslations[langKey]?.languageNameNative} (${allTranslations[langKey]?.languageNameInEnglish})`;
        }
        
        return { key: langKey, name: name };
    }).filter(Boolean); // Remove any null entries

    const handleChange = (event) => {
        const newLangKey = event.target.value;
        // If the placeholder "-- Select Language --" is chosen, its value is "", so pass null to context
        changeLanguage(newLangKey === "" ? null : newLangKey); 
    };

    // This useEffect for body class might be redundant if the main LanguageSelector also does it,
    // but keeping it for now to ensure freestyle specifically has its background.
    // Consider centralizing body class management if it becomes conflicting.
    useEffect(() => {
        const body = document.body;
        const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg' || cls.startsWith('COSY') || cls.startsWith('ТАКОЙ') || cls.startsWith('ΚΟΖΥ') || cls.startsWith('ԾՈՍՅ'));
        classesToRemove.forEach(cls => body.classList.remove(cls));
        
        if (currentLangKey && currentLangKey !== "null") { // Ensure currentLangKey is not the string "null"
            const langClassName = `${currentLangKey}-bg`;
            // A more robust check for class existence might be needed if dynamic loading of CSS is complex
            body.classList.add(langClassName);
            body.classList.add('lang-bg'); // General class for styling shared background properties
        } else {
            // Potentially add a default or "no-language-selected" background class
            body.classList.add('no-language-selected-bg'); 
        }
    }, [currentLangKey]);

    return (
        <div className="language-selector-container">
            <select 
                id="freestyle-language-select" 
                value={currentLangKey || ''} // If currentLangKey is null, value becomes "", matching the placeholder
                onChange={handleChange} 
                className="language-select-dropdown"
                aria-label={t('languageSelector.ariaLabel', 'Select language')}
            >
                <option value="">{t('languageSelector.selectPlaceholder', '-- Select Language --')}</option>
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
