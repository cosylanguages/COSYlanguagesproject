import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import translations from './translationsData';

const I18nContext = createContext();

export function useI18n() {
    return useContext(I18nContext);
}

export function I18nProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('cosyLanguage');
        // Ensure savedLanguage is a valid key in translations, otherwise default to 'COSYenglish'
        if (savedLanguage && translations[savedLanguage]) {
            return savedLanguage;
        }
        return 'COSYenglish'; // Default to COSYenglish if no valid language is saved or "null" is stored
    });

    const [currentTranslations, setCurrentTranslations] = useState({});

    /**
     * This effect runs when the language changes. It updates the local storage,
     * the current translations, and the lang attribute of the html tag.
     */
    useEffect(() => {
        // language state should always be a valid key (e.g. 'COSYenglish') due to initialization logic.
        if (translations[language]) {
            localStorage.setItem('cosyLanguage', language);
            setCurrentTranslations(translations[language]);
            let langCode = language.toLowerCase();
            if (translations[language].languageCode) {
                langCode = translations[language].languageCode;
            } else if (language.length > 2 && !['bashkir', 'breton', 'tatar'].includes(language)) {
                langCode = language.substring(0, 2);
            }
            document.documentElement.lang = langCode;
        } else {
            // This case implies 'language' state is somehow invalid, or COSYenglish itself is missing.
            console.error(`Critical: Translations for language key "${language}" not found. Attempting to default to COSYenglish.`);
            if (translations.COSYenglish) {
                setCurrentTranslations(translations.COSYenglish);
                localStorage.setItem('cosyLanguage', 'COSYenglish');
                document.documentElement.lang = translations.COSYenglish.languageCode || 'en';
                if (language !== 'COSYenglish') { // Correct state if it was somehow invalid
                    setLanguage('COSYenglish');
                }
            } else {
                // Absolute fallback if COSYenglish is also missing (problem with translationsData.js)
                setCurrentTranslations({});
                localStorage.removeItem('cosyLanguage'); // Remove invalid stored key
                document.documentElement.lang = 'en'; // Default doc lang
                console.error(`CRITICAL: Default 'COSYenglish' translations not found in translationsData.js.`);
            }
        }
    }, [language]);

    /**
     * Changes the language of the application.
     * @param {string} langKey - The key of the language to change to.
     */
    const changeLanguage = useCallback((langKey) => {
        if (translations && translations[langKey]) {
            setLanguage(langKey);
            if (location.pathname.startsWith('/study/')) {
                navigate(`/study/${translations[langKey].languageCode}`);
            }
        } else {
            console.warn(`Attempted to change to invalid language key "${langKey}". Reverting to COSYenglish.`);
            setLanguage('COSYenglish'); // Fallback to a known good default
        }
    }, [location, navigate]);

    /**
     * Translates a key to the current language.
     * @param {string} key - The key to translate.
     * @param {string|object} [defaultValueOrOptions] - The default value or an options object.
     * @param {object} [optionsOnly] - The options object.
     * @returns {string} The translated string.
     */
    const t = useCallback((key, defaultValueOrOptions, optionsOnly) => {
        let defaultValue = typeof defaultValueOrOptions === 'string' ? defaultValueOrOptions : key;
        let options = typeof defaultValueOrOptions === 'object' && !Array.isArray(defaultValueOrOptions) ? defaultValueOrOptions : optionsOnly;
        if (typeof optionsOnly === 'object' && typeof defaultValueOrOptions === 'string') {
            options = optionsOnly;
        }

        let translationString;
        // currentTranslations should always be populated (even with COSYenglish as fallback)
        if (currentTranslations && currentTranslations[key] !== undefined) {
            translationString = currentTranslations[key];
        } else if (translations.COSYenglish && translations.COSYenglish[key] !== undefined) {
            // Explicit fallback to COSYenglish if key is missing in current language
            translationString = translations.COSYenglish[key];
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
                const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Corrected regex
                try {
                    tempString = tempString.replace(new RegExp(`{${escapedPlaceholder}}`, 'g'), String(value));
                } catch (e) {
                    continue;
                }
            }
            translationString = tempString;
        }
        return translationString;
    }, [currentTranslations]); // Removed 'language' dependency

    /**
     * Gets the translations for a specific language.
     * @param {string} langKey - The key of the language.
     * @param {string} translationKey - The key of the translation.
     * @returns {object} The translations for the specified language.
     */
    const getTranslationsForLang = useCallback((langKey, translationKey) => {
        if (translations && translations[langKey] && translations[langKey][translationKey] !== undefined) {
            return translations[langKey][translationKey];
        } else if (translations && translations.english && translations.english[translationKey] !== undefined) {
            // Fallback to English (using standardized key 'english')
            return translations.english[translationKey];
        }
        return {}; // Return empty object or specific default if key not found in target or English
    }, []);

    const popularLanguageOrder = [
        'COSYenglish',
        'COSYspanish',
        'COSYfrench',
        'COSYportuguese',
        'COSYrussian',
        'COSYgerman',
        'COSYitalian',
    ];

    const sortedLanguages = Object.keys(translations)
        .filter(langKey => langKey !== 'null' && translations[langKey])
        .sort((a, b) => {
            const indexA = popularLanguageOrder.indexOf(a);
            const indexB = popularLanguageOrder.indexOf(b);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            if (indexA !== -1) {
                return -1;
            }
            if (indexB !== -1) {
                return 1;
            }
            const langA = translations[a];
            const langB = translations[b];
            return (langA.languageNameNative || a).localeCompare(langB.languageNameNative || b);
        });

    const sortedTranslations = {};
    sortedLanguages.forEach(langKey => {
        sortedTranslations[langKey] = translations[langKey];
    });

    const value = {
        language, // This can be null now
        currentLangKey: language,
        changeLanguage,
        t,
        allTranslations: sortedTranslations,
        getTranslationsForLang
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}
