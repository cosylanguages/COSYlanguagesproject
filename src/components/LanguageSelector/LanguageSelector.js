import React, { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './LanguageSelector.css';
import TransliterableText from '../Common/TransliterableText';

const LanguageSelector = () => {
    const { language, changeLanguage, allTranslations, currentLangKey, t } = useI18n();

    // Desired order of languages by popularity
    const popularLanguageOrder = [
      'COSYenglish',
      'COSYspanish',
      'COSYfrench',
      'COSYportugese',
      'COSYrussian',
      'COSYgerman',
      'COSYitalian',
      'COSYgreek',
      'COSYarmenian',
      'COSYtatar',
      'COSYbachkir',
      'COSYbreton',
    ];

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        // Skip "null" key if it appears, ensure the langKey actual entry exists
        if (langKey === "null" || !allTranslations[langKey]) return null; 

        const nativeName = allTranslations[langKey]?.languageNameNative;
        let name;

        if (nativeName) {
            name = nativeName;
        } else {
            name = allTranslations[langKey]?.languageNameInEnglish ||
                   langKey.replace(/^(COSY|ТАКОЙ|ΚΟΖΥ|ԾՈՍՅ)/, '');
        }
        // Combine native and English names if different, for clarity
        if (allTranslations[langKey]?.languageNameNative && 
            allTranslations[langKey]?.languageNameInEnglish && 
            allTranslations[langKey]?.languageNameNative !== allTranslations[langKey]?.languageNameInEnglish) {
            name = `${allTranslations[langKey]?.languageNameNative} (${allTranslations[langKey]?.languageNameInEnglish})`;
        }

        return { key: langKey, name: name };
    }).filter(Boolean) // Filter out any null entries from map
      .sort((a, b) => {
        const indexA = popularLanguageOrder.indexOf(a.key);
        const indexB = popularLanguageOrder.indexOf(b.key);

        // If both languages are in the popular list, sort by that order
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only A is in the popular list, it comes first
        if (indexA !== -1) {
            return -1;
        }
        // If only B is in the popular list, it comes first
        if (indexB !== -1) {
            return 1;
        }
        // If neither is in the popular list, sort alphabetically by name
        return a.name.localeCompare(b.name);
    });

    const handleChange = (event) => {
        const newLangKey = event.target.value;
        // If the placeholder "-- Select Language --" is chosen, its value is "", pass null.
        // Otherwise, pass the selected language key.
        changeLanguage(newLangKey === "" ? null : newLangKey);
    };

    // This useEffect for body class management should be reviewed for potential conflicts
    // if LanguageSelectorFreestyle also manages it. Ideally, one component or a higher-level
    // one should manage global body classes based on language.
    useEffect(() => {
        const body = document.body;
        const classesToRemove = Array.from(body.classList).filter(cls => 
            cls.endsWith('-bg') || 
            cls === 'lang-bg' || 
            cls === 'lang-bg-fallback' || 
            cls.startsWith('COSY') || cls.startsWith('ТАКОЙ') || cls.startsWith('ΚΟΖΥ') || cls.startsWith('ԾՈՍՅ') ||
            cls === 'no-language-selected-bg'
        );
        classesToRemove.forEach(cls => body.classList.remove(cls));

        if (currentLangKey && currentLangKey !== "null") { // Ensure currentLangKey is valid and not the string "null"
            const langClassName = `${currentLangKey}-bg`;
            // Check if class exists (optional, for robustness against missing CSS)
            const classExists = Array.from(document.styleSheets).some(sheet => {
                try {
                  return Array.from(sheet.cssRules || []).some(rule => rule.selectorText === `.${langClassName}`);
                } catch (e) { return false; }
            });

            if (classExists) {
                body.classList.add(langClassName);
                body.classList.add('lang-bg'); // General class for shared background properties
            } else {
                body.classList.add('lang-bg-fallback'); // Fallback if specific class is missing
            }
        } else {
            body.classList.add('no-language-selected-bg'); // Class when no language is selected
        }
    }, [currentLangKey]);

    return (
        <div className="language-selector-container">
            <label htmlFor="language-select" className="language-select-label">
                <TransliterableText text={t('languageSelector.label', '🌎:')} />
            </label>
            <select 
                id="language-select" 
                value={currentLangKey || ''} // Handles null currentLangKey by selecting the placeholder
                onChange={handleChange} 
                className="language-select-dropdown"
                aria-label={t('languageSelector.ariaLabel', 'Select language')}
            >
                {/* Add a placeholder option for when no language is selected */}
                <option value="">{t('languageSelector.selectPlaceholder', '-- Select Language --')}</option>
                {availableLanguages.map(lang => (
                    <option key={lang.key} value={lang.key}>
                        <TransliterableText text={lang.name} />
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
