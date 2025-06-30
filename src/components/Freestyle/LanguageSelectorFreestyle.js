import React, { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext'; 
import '../LanguageSelector/LanguageSelector.css'; // Import unified CSS

const LanguageSelectorFreestyle = ({ selectedLanguage }) => {
    const { allTranslations, changeLanguage, currentLangKey } = useI18n();

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
        const newLangKey = event.target.value;
        changeLanguage(newLangKey); // Change la langue globale du site
    };

    useEffect(() => {
        const body = document.body;
        // Supprimer les anciennes classes de fond
        const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg');
        classesToRemove.forEach(cls => body.classList.remove(cls));
        if (currentLangKey) {
            const langClassName = `${currentLangKey}-bg`;
            body.classList.add(langClassName);
            body.classList.add('lang-bg');
        }
    }, [currentLangKey]);

    return (
        <div className="language-selector-container"> {/* Use unified class */}
            <select 
                id="freestyle-language-select" 
                value={currentLangKey || ''} 
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
