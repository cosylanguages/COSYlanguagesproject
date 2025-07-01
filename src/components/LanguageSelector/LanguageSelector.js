import React, { useEffect } from 'react'; // Added useEffect
import { useI18n } from '../../i18n/I18nContext';
import './LanguageSelector.css';
import TransliterableText from '../Common/TransliterableText';

const LanguageSelector = () => {
    // Assuming currentLangKey is provided by useI18n and represents the actual language key string
    const { language, changeLanguage, allTranslations, currentLangKey } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        const nativeName = allTranslations[langKey]?.languageNameNative;
        let name;

        if (nativeName) {
            name = nativeName; // Prioritize native name
        } else {
            // DEV_NOTE: If languageNameNative and languageNameInEnglish are consistently populated
            // in all locale files, the following complex key parsing and specific overrides
            // could be significantly simplified or removed.
            // Fallback to English name or parsed key
            name = allTranslations[langKey]?.languageNameInEnglish ||
                   langKey.replace('COSY', '').replace('ТАКОЙ', '').replace('ΚΟΖΥ', '').replace('ԾՈՍՅ', ''); // General cleanup for display name
            
            // Specific overrides for English names if nativeName is not available
            if (langKey === 'ΚΟΖΥελληνικά') name = 'Greek';
            else if (langKey === 'ТАКОЙрусский') name = 'Russian';
            else if (langKey === 'ԾՈՍՅհայկական') name = 'Armenian';
            // Add other specific overrides if necessary
        }
        return { key: langKey, name: name };
    });

    const handleChange = (event) => {
        const newLangKey = event.target.value;
        changeLanguage(newLangKey); // This function should update currentLangKey in the I18nContext
    };

    useEffect(() => {
        const body = document.body;
        // Supprimer les anciennes classes de fond
        const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg' || cls === 'lang-bg-fallback');
        classesToRemove.forEach(cls => body.classList.remove(cls));

        if (currentLangKey) {
            const langClassName = `${currentLangKey}-bg`;
            // Test si la classe existe dans les feuilles de style chargées
            const classExists = Array.from(document.styleSheets).some(sheet => {
                try {
                  return Array.from(sheet.cssRules || []).some(rule => rule.selectorText === `.${langClassName}`);
                } catch (e) { return false; }
            });
            if (classExists) {
                body.classList.add(langClassName);
                body.classList.add('lang-bg');
            } else {
                body.classList.add('lang-bg-fallback');
            }
        } else {
            body.classList.add('lang-bg-fallback');
        }
    }, [currentLangKey]); // Effect depends on currentLangKey from context

    return (
        <div className="language-selector-container">
            <label htmlFor="language-select" className="language-select-label">
                🌎:
            </label>
            {/* The select's value should be the currentLangKey from context */}
            <select 
                id="language-select" 
                value={currentLangKey || language || ''} // Use currentLangKey, fallback to language, then to empty string
                onChange={handleChange} 
                className="language-select-dropdown"
            >
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
