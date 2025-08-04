import { useState, useEffect } from 'react';
import { loadConjugationData, loadEnglishIrregularVerbsData } from '../utils/conjugationDataService';

// This is the reverse mapping of langFileMap in exerciseDataService.js
const langIdentifierMap = {
    'english': 'COSYenglish',
    'french': 'COSYfrench',
    'spanish': 'COSYespañol',
    'italian': 'COSYitalian',
    'german': 'COSYdeutsch',
    'portuguese': 'COSYportugese',
    'greek': 'COSYgreek',
    'russian': 'COSYrussian',
    'armenian': 'COSYarmenian',
    'breton': 'COSYbrezhoneg',
    'tatar': 'COSYtatar',
    'bashkir': 'COSYbachkir'
};

const transformEnglishVerbs = (data) => {
    if (!data) return [];
    let allVerbs = [];
    data.forEach(category => {
        const transformed = category.verbs.map(verb => ({
            ...verb,
            infinitive: verb.base,
            translation_en: verb.translation
        }));
        allVerbs.push(...transformed);
    });
    return allVerbs;
};


/**
 * A custom hook that fetches and filters verb data.
 * @param {string} levels - A comma-separated string of verb levels to filter by.
 * @param {string} lang - The language of the verbs to fetch (e.g., 'en', 'es').
 * @returns {{verbs: Array, loading: boolean, error: object|null}} An object containing the filtered verbs, a loading state, and an error object.
 */
const useVerbs = (levels, lang) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerbs = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                let fetchError;

                if (lang === 'en' || lang === 'english') {
                    const englishData = await loadEnglishIrregularVerbsData();
                    data = transformEnglishVerbs(englishData.data);
                    fetchError = englishData.error;
                } else {
                    const languageIdentifier = langIdentifierMap[lang] || `COSY${lang}`;
                    const conjugationData = await loadConjugationData(languageIdentifier);
                    data = conjugationData.data ? conjugationData.data.verbs : [];
                    fetchError = conjugationData.error;
                }

                if (fetchError && fetchError.errorType === 'fileNotFound') {
                    console.warn(fetchError.error);
                    setVerbs([]);
                } else if (fetchError) {
                    throw new Error(fetchError.error);
                } else {
                    let filteredVerbs = data;
                    if (levels && levels !== 'all') {
                        const levelSet = new Set(levels.split(','));
                        filteredVerbs = data.filter(verb => {
                            return !verb.verb_group || levelSet.has(verb.verb_group);
                        });
                    }
                    setVerbs(filteredVerbs);
                }
            } catch (err) {
                console.error('Error fetching or processing verbs:', err);
                setError(err);
                setVerbs([]);
            } finally {
                setLoading(false);
            }
        };

        if (lang) {
            fetchVerbs();
        } else {
            setVerbs([]);
            setLoading(false);
        }
    }, [levels, lang]);

    return { verbs, loading, error };
};

export default useVerbs;
