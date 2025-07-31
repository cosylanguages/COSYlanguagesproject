import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import translations from './translationsData';

/**
 * The i18n context.
 */
export const I18nContext = createContext();

/**
 * A custom hook for accessing the i18n context.
 * @returns {object} The i18n context.
 */
export function useI18n() {
    return useContext(I18nContext);
}

/**
 * A provider for the i18n context.
 * It manages the i18n state and provides functions for changing the language and translating text.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The I18nProvider component.
 */
export function I18nProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('cosyLanguage');
        if (savedLanguage && translations[savedLanguage]) {
            return savedLanguage;
        }
        return 'en';
    });

    const [currentTranslations, setCurrentTranslations] = useState({});

    // Effect to set the language from the URL.
    useEffect(() => {
        const langFromUrl = params.lang || location.pathname.split('/')[1];
        if (langFromUrl && translations[langFromUrl]) {
            setLanguage(langFromUrl);
        }
    }, [params.lang, location.pathname]);

    // Effect to update the translations and the document's lang attribute when the language changes.
    useEffect(() => {
        if (translations[language]) {
            localStorage.setItem('cosyLanguage', language);
            setCurrentTranslations(translations[language]);
            document.documentElement.lang = language;
        } else {
            console.error(`Translations for language key "${language}" not found. Defaulting to English.`);
            if (translations.en) {
                setCurrentTranslations(translations.en);
                localStorage.setItem('cosyLanguage', 'en');
                document.documentElement.lang = 'en';
                if (language !== 'en') {
                    setLanguage('en');
                }
            } else {
                setCurrentTranslations({});
                localStorage.removeItem('cosyLanguage');
                document.documentElement.lang = 'en';
                console.error("CRITICAL: Default 'en' translations not found in translationsData.js.");
            }
        }
    }, [language]);

    /**
     * Changes the current language.
     * @param {string} langKey - The key for the new language.
     */
    const changeLanguage = useCallback((langKey) => {
        const newLang = translations[langKey] ? langKey : 'en';
        setLanguage(newLang);

        const pathParts = location.pathname.split('/');
        if (pathParts[1] === 'study' && pathParts.length > 2) {
            if (pathParts[2] !== newLang) {
                navigate(`/study/${newLang}`);
            }
        }
    }, [location.pathname, navigate]);

    /**
     * Translates a given key.
     * @param {string} key - The key to translate.
     * @param {string|object} [defaultValueOrOptions] - The default value or an object of options.
     * @param {object} [optionsOnly] - An object of options.
     * @returns {string} The translated string.
     */
    const t = useCallback((key, defaultValueOrOptions, optionsOnly) => {
        let defaultValue = typeof defaultValueOrOptions === 'string' ? defaultValueOrOptions : key;
        let options = typeof defaultValueOrOptions === 'object' && !Array.isArray(defaultValueOrOptions) ? defaultValueOrOptions : optionsOnly;
        if (typeof optionsOnly === 'object' && typeof defaultValueOrOptions === 'string') {
            options = optionsOnly;
        }

        let translationString;
        if (currentTranslations && currentTranslations[key] !== undefined) {
            translationString = currentTranslations[key];
        } else if (translations.en && translations.en[key] !== undefined) {
            translationString = translations.en[key];
        }
        else {
            translationString = defaultValue;
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
    }, [currentTranslations]);

    /**
     * Gets the translations for a given language and key.
     * @param {string} langKey - The language key.
     * @param {string} translationKey - The translation key.
     * @returns {object} The translations for the given language and key.
     */
    const getTranslationsForLang = useCallback((langKey, translationKey) => {
        if (translations && translations[langKey] && translations[langKey][translationKey] !== undefined) {
            return translations[langKey][translationKey];
        } else if (translations && translations.en && translations.en[translationKey] !== undefined) {
            return translations.en[translationKey];
        }
        return {};
    }, []);

    const value = {
        language,
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
