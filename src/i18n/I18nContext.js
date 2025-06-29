import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from './translations'; // Assuming translations.js is in the same directory

const I18nContext = createContext();

export function useI18n() {
    return useContext(I18nContext);
}

export function I18nProvider({ children }) {
    const [language, setLanguage] = useState(localStorage.getItem('cosyLanguage') || 'COSYenglish');
    const [currentTranslations, setCurrentTranslations] = useState(translations[language] || translations.COSYenglish);

    useEffect(() => {
        localStorage.setItem('cosyLanguage', language);
        setCurrentTranslations(translations[language] || translations.COSYenglish);
        // Optionally, update document language attribute
        document.documentElement.lang = language.substring(4).toLowerCase(); // e.g., "en" from "COSYenglish"
    }, [language]);

    const changeLanguage = useCallback((langKey) => {
        if (translations[langKey]) {
            setLanguage(langKey);
        } else {
            console.warn(`Language key "${langKey}" not found in translations. Defaulting to English.`);
            setLanguage('COSYenglish');
        }
    }, []);

    const t = useCallback((key, options = {}) => {
        let translation = currentTranslations[key] || translations.COSYenglish[key] || key;
        
        // Basic placeholder replacement, e.g., t('levelUpToast', { level: 5 })
        if (options && typeof translation === 'string') {
            for (const placeholder in options) {
                translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), options[placeholder]);
            }
        }
        return translation;
    }, [currentTranslations]);

    // Function to get translations for a specific language, primarily for dayNames
    const getTranslationsForLang = useCallback((langKey, translationKey) => {
        const targetLangTranslations = translations[langKey] || translations.COSYenglish;
        return targetLangTranslations[translationKey] || {};
    }, []);


    const value = {
        language,
        changeLanguage,
        t, // Translation function
        allTranslations: translations, // Expose all translations if needed
        getTranslationsForLang // Expose function to get dayNames for a specific language
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}
