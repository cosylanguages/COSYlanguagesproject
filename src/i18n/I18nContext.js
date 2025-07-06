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
        // Ensure fallback uses the new standardized key
        return (translations[savedLanguage]) ? savedLanguage : 'english';
    });

    const [currentTranslations, setCurrentTranslations] = useState({});

    useEffect(() => {
        if (language === null) {
            localStorage.removeItem('cosyLanguage'); // Remove item if language is null
            setCurrentTranslations({}); // No translations for null language
            document.documentElement.lang = 'en'; // Default doc lang to 'en' (ISO code)
        } else if (translations && translations[language]) {
            localStorage.setItem('cosyLanguage', language); // Save standardized key
            setCurrentTranslations(translations[language]);
            // Set document.documentElement.lang based on the standardized key
            // This assumes standardized keys are suitable or can be mapped to ISO 639-1 codes
            // For simple English names like "english", "french", we can map them or use them directly if that's the convention.
            // For this iteration, we'll use the first two letters if the key is long enough, otherwise the key itself.
            // A more robust mapping to ISO codes would be ideal in the long run.
            let langCode = language.toLowerCase(); // Start with the key itself
            if (translations[language] && translations[language].languageCode) {
                langCode = translations[language].languageCode; // Use languageCode if defined in locale file
            } else if (language.length > 2 && !['bashkir', 'breton', 'tatar'].includes(language)) { // crude way to get ISO-like codes for some
                langCode = language.substring(0, 2);
            }
            document.documentElement.lang = langCode;

        } else if (translations && translations.english) { // Fallback to standardized 'english'
            console.warn(`Translations for language key "${language}" not found. Defaulting to English.`);
            setCurrentTranslations(translations.english);
            localStorage.setItem('cosyLanguage', 'english'); // Persist the fallback with standardized key
            document.documentElement.lang = 'en';
            // To prevent potential loops if `language` state was invalid and needs resetting:
            if (language !== 'english') {
                 setLanguage('english'); // This will trigger a re-render and this effect again.
            }
        } else {
            setCurrentTranslations({});
            localStorage.removeItem('cosyLanguage');
            document.documentElement.lang = 'en'; // Default doc lang
            console.error(`Critical: Default English translations ('english') not found.`);
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
        } else if (translations && translations.english && translations.english[key] !== undefined) {
            // Fallback to English (using standardized key 'english') if current language is null or key is missing
            translationString = translations.english[key];
        } else {
            translationString = defaultValue; // Use provided default or the key itself
        }

        if (options && typeof translationString === 'string') {
            let tempString = translationString;
            for (const placeholder in options) {
                if (!placeholder || /^\d+$/.test(placeholder)) continue;
                const value = options[placeholder];
                if (value === undefined || value === null) continue;
                const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\]/g, '\$&');
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
        } else if (translations && translations.english && translations.english[translationKey] !== undefined) {
            // Fallback to English (using standardized key 'english')
            return translations.english[translationKey];
        }
        return {}; // Return empty object or specific default if key not found in target or English
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
