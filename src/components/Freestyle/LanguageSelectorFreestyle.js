import React from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Adjusted path if necessary

// Assuming a similar CSS class can be used or define specific styles
// import '../LanguageSelector/LanguageSelector.css'; 

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

    // Basic styling, can be enhanced with CSS file
    const selectStyle = {
        padding: '10px 15px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '200px', // Ensure it has some width
    };

    const labelStyle = {
      marginRight: '10px',
      fontSize: '1rem',
      fontWeight: '500',
    };

    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Ensures content within is centered if container is wider
      width: '100%', // Takes width from parent (.selector-container)
    };

    return (
        <div style={containerStyle} className="language-selector-freestyle-container"> {/* Added class for potential CSS targeting */}
            <label htmlFor="freestyle-language-select" style={labelStyle}>
                🌎:
            </label>
            <select 
                id="freestyle-language-select" 
                value={selectedLanguage} 
                onChange={handleChange} 
                style={selectStyle}
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
