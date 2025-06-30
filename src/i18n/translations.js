import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from './translations'; // Assuming translations.js is in the same directory

const I18nContext = createContext();

export function useI18n() {
    return useContext(I18nContext);
}

export function I18nProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        // Initialize language from localStorage or default to 'COSYenglish'
        const savedLanguage = localStorage.getItem('cosyLanguage');
        // Ensure the saved language is valid, otherwise default
        return (savedLanguage && translations[savedLanguage]) ? savedLanguage : 'COSYenglish';
    });
    
    // currentTranslations will be derived from `language` and `translations` in useEffect
    // Initialize with an empty object or default to English to avoid issues during first render
    const [currentTranslations, setCurrentTranslations] = useState(() => {
        const initialLang = localStorage.getItem('cosyLanguage') || 'COSYenglish';
        if (translations && translations[initialLang]) {
            return translations[initialLang];
        } else if (translations && translations.COSYenglish) {
            return translations.COSYenglish;
        }
        return {}; // Fallback to empty object if all else fails
    });

    useEffect(() => {
        // Update localStorage when language changes
        localStorage.setItem('cosyLanguage', language);

        // Update currentTranslations based on the new language
        // Ensure translations object itself is available and the specific language pack exists
        if (translations && translations[language]) {
            setCurrentTranslations(translations[language]);
        } else if (translations && translations.COSYenglish) {
            // Fallback to English if the selected language pack is missing
            setCurrentTranslations(translations.COSYenglish);
            // Optionally, reset language to 'COSYenglish' if desired language is truly unavailable
            // and the current language is not already COSYenglish
            if (language !== 'COSYenglish') {
                 console.warn(`Translations for language key "${language}" not found. Defaulting to English translations and setting language to COSYenglish.`);
                 setLanguage('COSYenglish'); // This will trigger the effect again with COSYenglish
            } else {
                console.warn(`Translations for language key "${language}" not found. Using English translations.`);
            }
        } else {
            // Fallback if COSYenglish is also missing (should not happen if en.js is correct and exported)
            setCurrentTranslations({}); 
            console.error(`Critical: Default English translations (COSYenglish) not found. Translations will not work.`);
        }
        
        // Optionally, update document language attribute
        // Ensure language is a string and long enough before substring
        if (typeof language === 'string' && language.length > 4) {
            document.documentElement.lang = language.substring(4).toLowerCase(); // e.g., "en" from "COSYenglish"
        }
    }, [language]);

    const changeLanguage = useCallback((langKey) => {
        // Check against the main translations object to see if the langKey is valid
        if (translations && translations[langKey]) {
            setLanguage(langKey);
        } else {
            console.warn(`Attempted to change to invalid language key "${langKey}". Defaulting to English.`);
            setLanguage('COSYenglish'); // Fallback to English if the key is invalid
        }
    }, []); // `translations` is stable as it's a top-level import

    const t = useCallback((key, options = {}) => {
        let translationString;

        if (currentTranslations && currentTranslations[key] !== undefined) {
            translationString = currentTranslations[key];
        } else if (translations && translations.COSYenglish && translations.COSYenglish[key] !== undefined) {
            translationString = translations.COSYenglish[key];
        } else {
            translationString = key; // Final fallback to the key itself
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
                    // Ignore invalid regex
                    continue;
                }
            }
            translationString = tempString;
        }
        return translationString;
    }, [currentTranslations]); // Depend on currentTranslations

    const getTranslationsForLang = useCallback((langKey, translationKey) => {
        if (translations && translations[langKey] && translations[langKey][translationKey] !== undefined) {
            return translations[langKey][translationKey];
        } else if (translations && translations.COSYenglish && translations.COSYenglish[translationKey] !== undefined) {
            return translations.COSYenglish[translationKey];
        }
        return {}; // Return empty object if the key or language isn't found
    }, []); // `translations` is stable

    const value = {
        language, // This is the current language key, e.g., 'COSYenglish'
        currentLangKey: language, // Explicitly exposing it as currentLangKey
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
