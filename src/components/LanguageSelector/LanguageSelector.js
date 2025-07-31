import React, { useEffect } from 'react'; // Added useEffect
import { useI18n } from '../../i18n/I18nContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
    // Assuming currentLangKey is provided by useI18n and represents the actual language key string
    const { language, changeLanguage, allTranslations, currentLangKey } = useI18n();

    const availableLanguages = Object.keys(allTranslations).map(langKey => {
        let name = allTranslations[langKey]?.languageNameInEnglish || 
                   langKey.replace('COSY', '').replace('ТАКОЙ', '').replace('ΚΟΖΥ', '').replace('ԾՈՍՅ', ''); // General cleanup for display name
        
        if (langKey === 'ΚΟΖΥελληνικά') name = 'Greek';
        else if (langKey === 'ТАКОЙрусский') name = 'Russian';
        else if (langKey === 'ԾՈՍՅհայկական') name = 'Armenian';
        // Add other specific overrides if necessary

        const nativeName = allTranslations[langKey]?.languageNameNative;
        if (nativeName) {
            name = `${nativeName} (${name})`;
        }
        return { key: langKey, name: name };
    });

    const handleChange = (event) => {
        const newLangKey = event.target.value;
        changeLanguage(newLangKey); // This function should update currentLangKey in the I18nContext
    };

    useEffect(() => {
        const body = document.body;
        
        // Clear previous language classes
        const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg');
        classesToRemove.forEach(cls => body.classList.remove(cls));

        if (currentLangKey) {
            // currentLangKey is expected to be like 'COSYenglish', 'COSYfrançais', etc.
            // These directly map to CSS class prefixes defined in src/index.css
            const langClassName = `${currentLangKey}-bg`;
            body.classList.add(langClassName);
            body.classList.add('lang-bg'); // Add base class for shared properties
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
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
