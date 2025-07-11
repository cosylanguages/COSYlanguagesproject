import React, { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import '../LanguageSelector/LanguageSelector.css'; // Import unified CSS

const LanguageSelectorFreestyle = ({ onLanguageChange }) => { // Accept onLanguageChange prop
    const { allTranslations, currentLangKey, t } = useI18n(); // Removed changeLanguage

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        // Skip "null" if it somehow ends up in allTranslations keys, though it shouldn't
        if (langKey === "null" || !allTranslations[langKey]) return null;

        let name = allTranslations[langKey]?.languageNameNative ||
                   allTranslations[langKey]?.languageNameInEnglish ||
                   // Standardized keys (e.g., 'english') can serve as a fallback
                   langKey.charAt(0).toUpperCase() + langKey.slice(1);


        if (allTranslations[langKey]?.languageNameNative &&
            allTranslations[langKey]?.languageNameInEnglish &&
            allTranslations[langKey]?.languageNameNative !== allTranslations[langKey]?.languageNameInEnglish) {
            name = `${allTranslations[langKey]?.languageNameNative} (${allTranslations[langKey]?.languageNameInEnglish})`;
        }

        return { key: langKey, name: name };
    }).filter(Boolean); // Remove any null entries

    const handleChange = (event) => {
        const newLangKey = event.target.value;
        // Call the onLanguageChange prop passed from LanguageIslandApp
        if (onLanguageChange) {
            onLanguageChange(newLangKey);
        }
        // The I18nContext's changeLanguage will be called by the callback in LanguageIslandApp
    };

    // This useEffect for body class might be redundant if the main LanguageSelector also does it.
    // This logic will be centralized later as per the plan.
    useEffect(() => {
        const body = document.body;
        const currentLanguageKeys = Object.keys(allTranslations || {}); // Ensure allTranslations is not null/undefined
        const classesToRemove = Array.from(body.classList).filter(cls =>
            cls.endsWith('-bg') ||
            cls === 'lang-bg' ||
            cls === 'lang-bg-fallback' ||
            // Check against current known language keys for more precise removal
            currentLanguageKeys.some(key => cls.startsWith(key + '-bg')) ||
            cls.startsWith('COSY') || // Keep old prefix for cleanup during transition
            cls.startsWith('ТАКОЙ') ||
            cls.startsWith('ΚΟΖΥ') ||
            cls.startsWith('ԾՈՍՅ') ||
            cls === 'no-language-selected-bg'
        );
        classesToRemove.forEach(cls => body.classList.remove(cls));

        if (currentLangKey && currentLangKey !== "null") { // Ensure currentLangKey is not the string "null"
            const langClassName = `${currentLangKey}-bg`; // Uses new standardized key
            // A more robust check for class existence might be needed if dynamic loading of CSS is complex.
            // This check might be intensive, consider if truly necessary.
            const classExists = Array.from(document.styleSheets).some(sheet => {
                try {
                  return Array.from(sheet.cssRules || []).some(rule => rule.selectorText === `.${langClassName}`);
                } catch (e) { return false; }
            });

            if (classExists) {
                body.classList.add(langClassName);
                body.classList.add('lang-bg'); // General class for styling shared background properties
            } else {
                body.classList.add('lang-bg-fallback');
            }
        } else {
            body.classList.add('no-language-selected-bg');
        }
    }, [currentLangKey, allTranslations]); // Added allTranslations to dependency array

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
