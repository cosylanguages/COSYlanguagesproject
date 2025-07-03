import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from './translationsData'; 

const I18nContext = createContext();

export function useI18n() {
    return useContext(I18nContext);
}

export function I18nProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('cosyLanguage');
        if (savedLanguage === "null" || savedLanguage === null || savedLanguage === undefined) {
            return null; // Explicitly handle "null" string from localStorage or no value
        }
        return (translations[savedLanguage]) ? savedLanguage : 'COSYenglish'; // Fallback for invalid keys
    });
    
    const [currentTranslations, setCurrentTranslations] = useState({});

    useEffect(() => {
        if (language === null) {
            localStorage.removeItem('cosyLanguage'); // Remove item if language is null
            setCurrentTranslations({}); // No translations for null language
            document.documentElement.lang = 'en'; // Default doc lang
        } else if (translations && translations[language]) {
            localStorage.setItem('cosyLanguage', language);
            setCurrentTranslations(translations[language]);
            if (typeof language === 'string' && language.length > 4) {
                 // Ensure language is a string and long enough
                const langCode = language.replace(/^(COSY|ТАКОЙ|ΚΟΖΥ|ԾՈՍՅ)/, '').toLowerCase();
                document.documentElement.lang = langCode;
            } else {
                document.documentElement.lang = 'en'; // Fallback doc lang
            }
        } else if (translations && translations.COSYenglish) {
            // This case handles if language is an invalid key but not null
            console.warn(`Translations for language key "${language}" not found. Defaulting to English.`);
            setCurrentTranslations(translations.COSYenglish);
            localStorage.setItem('cosyLanguage', 'COSYenglish'); // Persist the fallback
            document.documentElement.lang = 'en';
            // setLanguage('COSYenglish'); // This would trigger a re-render and effect loop.
                                        // The above localStorage.setItem and setCurrentTranslations handle the state for current cycle.
                                        // If direct state update is desired, ensure it doesn't loop infinitely.
                                        // For now, allowing an invalid key to temporarily exist in state but use English resources.
                                        // Or, more strictly:
            // if (language !== 'COSYenglish') setLanguage('COSYenglish');
        } else {
            setCurrentTranslations({});
            localStorage.removeItem('cosyLanguage');
            document.documentElement.lang = 'en';
            console.error(`Critical: Default English translations (COSYenglish) not found.`);
        }
    }, [language]);

    const changeLanguage = useCallback((langKey) => {
        if (langKey === null) {
            setLanguage(null);
        } else if (translations && translations[langKey]) {
            setLanguage(langKey);
        } else {
            console.warn(`Attempted to change to invalid language key "${langKey}". Setting to null (no selection).`);
            setLanguage(null); // Fallback to null if the key is invalid
        }
    }, []);

    const t = useCallback((key, defaultValueOrOptions, optionsOnly) => {
        let defaultValue = typeof defaultValueOrOptions === 'string' ? defaultValueOrOptions : key;
        let options = typeof defaultValueOrOptions === 'object' ? defaultValueOrOptions : optionsOnly;
        if (typeof optionsOnly === 'object' && typeof defaultValueOrOptions === 'string') {
            options = optionsOnly; // Correctly assign options if defaultvalue is also provided
        }


        let translationString;
        if (language && currentTranslations && currentTranslations[key] !== undefined) {
            translationString = currentTranslations[key];
        } else if (translations && translations.COSYenglish && translations.COSYenglish[key] !== undefined) {
            // Fallback to English if current language is null or key is missing
            translationString = translations.COSYenglish[key];
        } else {
            translationString = defaultValue; // Use provided default or the key itself
        }
        
        if (options && typeof translationString === 'string') {
            let tempString = translationString;
            for (const placeholder in options) {
                if (!placeholder || /^\d+$/.test(placeholder)) continue;
                const value = options[placeholder];
                if (value === undefined || value === null) continue;
                const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                try {
                    tempString = tempString.replace(new RegExp(`{${escapedPlaceholder}}`, 'g'), String(value));
                } catch (e) {
                    continue;
                }
            }
            translationString = tempString;
        }
        return translationString;
    }, [language, currentTranslations]);

    const getTranslationsForLang = useCallback((langKey, translationKey) => {
        if (translations && translations[langKey] && translations[langKey][translationKey] !== undefined) {
            return translations[langKey][translationKey];
        } else if (translations && translations.COSYenglish && translations.COSYenglish[translationKey] !== undefined) {
            return translations.COSYenglish[translationKey];
        }
        return {};
    }, []);

    const value = {
        language, // This can be null now
        currentLangKey: language, 
        changeLanguage,
        t,
        allTranslations: translations,
        getTranslationsForLang
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}
